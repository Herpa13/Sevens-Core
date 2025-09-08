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

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'DbInstanceArn', { value: db.instanceArn });
    new cdk.CfnOutput(this, 'RdsProxyEndpoint', { value: proxy.endpoint });
    new cdk.CfnOutput(this, 'QueueArn', { value: queue.queueArn });
    new cdk.CfnOutput(this, 'BucketArn', { value: bucket.bucketArn });
  }
}
