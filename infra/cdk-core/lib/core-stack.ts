import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class CoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'CoreVpc', {
      maxAzs: 2,
      natGateways: 0
    });

    const lambdaSg = new ec2.SecurityGroup(this, 'CoreLambdaSg', { vpc });
    const dbSg = new ec2.SecurityGroup(this, 'CoreDbSg', { vpc });
    const proxySg = new ec2.SecurityGroup(this, 'CoreProxySg', { vpc });

    // VPC Endpoints for private connectivity to AWS services
    vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3
    });

    vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      securityGroups: [lambdaSg]
    });

    vpc.addInterfaceEndpoint('LogsEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      securityGroups: [lambdaSg]
    });

    vpc.addInterfaceEndpoint('ApiGatewayEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
      securityGroups: [lambdaSg]
    });

    const dbSecret = new rds.DatabaseSecret(this, 'CoreDbSecret', {
      username: 'coreuser'
    });

    const db = new rds.DatabaseInstance(this, 'CoreDb', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_3
      }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbSecret),
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      publiclyAccessible: false,
      multiAz: true,
      securityGroups: [dbSg]
    });

    dbSecret.addRotationSchedule('CoreDbRotation', {
      hostedRotation: secretsmanager.HostedRotation.postgreSqlSingleUser({
        vpc
      })
    });

    const proxy = db.addProxy('CoreDbProxy', {
      secrets: [dbSecret],
      vpc,
      securityGroups: [proxySg]
    });

    db.connections.allowFrom(proxy, ec2.Port.tcp(5432));
    proxy.connections.allowFrom(lambdaSg, ec2.Port.tcp(5432));

    const fn = new lambda.Function(this, 'CoreGatewayFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler=async()=>({statusCode:200,body:"ok"});'),
      vpc,
      securityGroups: [lambdaSg],
      environment: {
        DATABASE_HOST: proxy.endpoint,
        DB_SECRET_ARN: dbSecret.secretArn
      }
    });

    dbSecret.grantRead(fn);
    proxy.grantConnect(fn, 'coreuser');

    const api = new apigateway.LambdaRestApi(this, 'CoreGatewayApi', {
      handler: fn
    });

    const queue = new sqs.Queue(this, 'CoreQueue');
    const bucket = new s3.Bucket(this, 'CoreBucket');

    const openApiBucket = new s3.Bucket(this, 'OpenApiBucket', {
      versioned: true,
    });

    const openApiDistribution = new cloudfront.Distribution(this, 'OpenApiDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(openApiBucket) },
    });

    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
    });

    const frontendDistribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(frontendBucket), viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS },
      defaultRootObject: 'index.html',
    });

    const dbMigrate = new codebuild.Project(this, 'DbMigrateProject', {
      projectName: 'db-migrate',
      vpc,
      securityGroups: [lambdaSg],
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL
      },
      environmentVariables: {
        DB_SECRET_ARN: { value: dbSecret.secretArn },
        DATABASE_HOST: { value: proxy.endpoint }
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['corepack enable', 'yarn install --immutable']
          },
          build: {
            commands: [
              'SECRET=$(aws secretsmanager get-secret-value --secret-id $DB_SECRET_ARN --query SecretString --output text)',
              'USER=$(echo $SECRET | jq -r .username)',
              'PASS=$(echo $SECRET | jq -r .password)',
              'export DATABASE_URL="postgresql://$USER:$PASS@$DATABASE_HOST:5432/postgres"',
              'npx prisma migrate deploy --schema packages/db/prisma/schema.prisma'
            ]
          }
        }
      })
    });

    dbSecret.grantRead(dbMigrate);

    const openApiPublish = new codebuild.Project(this, 'OpenApiPublishProject', {
      projectName: 'openapi-publish',
      vpc,
      securityGroups: [lambdaSg],
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL
      },
      environmentVariables: {
        OPENAPI_BUCKET: { value: openApiBucket.bucketName }
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['corepack enable', 'yarn install --immutable']
          },
          build: {
            commands: [
              'yarn workspace @sevens/core-gateway openapi',
              'aws s3 cp apps/core-gateway/openapi.json s3://$OPENAPI_BUCKET/openapi.json'
            ]
          }
        }
      })
    });

    openApiBucket.grantReadWrite(openApiPublish);

    const frontendPublish = new codebuild.Project(this, 'FrontendPublishProject', {
      projectName: 'frontend-publish',
      vpc,
      securityGroups: [lambdaSg],
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL
      },
      environmentVariables: {
        FRONTEND_BUCKET: { value: frontendBucket.bucketName },
        VITE_API_BASE: { value: api.url }
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['corepack enable', 'yarn install --immutable']
          },
          build: {
            commands: [
              'yarn build',
              'aws s3 sync dist s3://$FRONTEND_BUCKET/ --delete'
            ]
          }
        }
      })
    });

    frontendBucket.grantReadWrite(frontendPublish);

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'DbInstanceArn', { value: db.instanceArn });
    new cdk.CfnOutput(this, 'RdsProxyEndpoint', { value: proxy.endpoint });
    new cdk.CfnOutput(this, 'QueueArn', { value: queue.queueArn });
    new cdk.CfnOutput(this, 'BucketArn', { value: bucket.bucketArn });
    new cdk.CfnOutput(this, 'DbMigrateProjectName', { value: dbMigrate.projectName });
    new cdk.CfnOutput(this, 'OpenApiUrl', { value: `https://${openApiDistribution.domainName}/openapi.json` });
    new cdk.CfnOutput(this, 'OpenApiPublishProjectName', { value: openApiPublish.projectName });
    new cdk.CfnOutput(this, 'FrontendUrl', { value: `https://${frontendDistribution.domainName}` });
    new cdk.CfnOutput(this, 'FrontendPublishProjectName', { value: frontendPublish.projectName });
  }
}
