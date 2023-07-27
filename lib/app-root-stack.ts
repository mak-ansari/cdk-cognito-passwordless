import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppCognitoStack } from './cognito/app-cognito-stack';
import { IConfig } from '../context/types';

interface AppRootStackProps extends cdk.StackProps {
    envConfig: IConfig
}

export class AppRootStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AppRootStackProps) {
        super(scope, id, props);

        const { envConfig } = props;

        // Define Cognito Stack
        const appCognito = new AppCognitoStack(this, 'AppCognitoStack', { envConfig });
    }
}
