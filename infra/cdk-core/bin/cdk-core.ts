#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CoreStack } from '../lib/core-stack';

const app = new cdk.App();
new CoreStack(app, 'CoreStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || '111111111111',
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  }
});
