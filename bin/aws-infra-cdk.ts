#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppRootStack } from '../lib/app-root-stack';

// Initialize all configuration
import { CONFIG } from '../context/components/configuration';
import { EnvironmentType } from '../context/models/enums';

// Initialize the CDK app
const app = new cdk.App();

// [DEV Environment] Initialize the root stack
new AppRootStack(app, `CdkAppRootStack-${EnvironmentType.DEV}`, {
    stackName: `app-root-stack-${EnvironmentType.DEV}`,
    env: CONFIG[EnvironmentType.DEV].env,
    envConfig: CONFIG[EnvironmentType.DEV]
});