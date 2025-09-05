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

    const dbSecret = new secretsmanager.Secret(this, 'CoreDbSecret', {
      secretName: 'core-db-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'coreuser' }),
        generateStringKey: 'password'
      }
    });

    const db = new rds.DatabaseInstance(this, 'CoreDb', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_3
      }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbSecret),
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      publiclyAccessible: false
    });

    const fn = new lambda.Function(this, 'CoreGatewayFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler=async()=>({statusCode:200,body:"ok"});'),
      vpc,
      environment: {
        DATABASE_HOST: db.instanceEndpoint.hostname,
        DB_SECRET_ARN: dbSecret.secretArn
      }
    });

    dbSecret.grantRead(fn);

    const api = new apigateway.LambdaRestApi(this, 'CoreGatewayApi', {
      handler: fn
    });

    const queue = new sqs.Queue(this, 'CoreQueue');
    const bucket = new s3.Bucket(this, 'CoreBucket');

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'DbInstanceArn', { value: db.instanceArn });
    new cdk.CfnOutput(this, 'QueueArn', { value: queue.queueArn });
    new cdk.CfnOutput(this, 'BucketArn', { value: bucket.bucketArn });
  }
}
