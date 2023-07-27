import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import path = require('path');

import { IConfig } from '../../context/types';

interface AppCognitoStackProps extends cdk.StackProps {
    envConfig: IConfig;
}

export class AppCognitoStack extends cdk.Stack {

    userPool: cdk.aws_cognito.IUserPool;

    constructor(scope: Construct, id: string, props: AppCognitoStackProps) {
        super(scope, id, props);

        const { envConfig: { environment} } = props; //Inherited Environment
        
        // Parameters
        const userPoolName = new cdk.CfnParameter(this, 'UserPoolName', {
            type: 'String',
            description: 'The name you want the User Pool to be created with',
            default: `${environment}-cognito-user-pool`
        });

        // Lambda Functions | Define Auth challenge
        const defineAuthChallengeFn = new lambda.Function(this, 'DefineAuthChallenge', {
            functionName: `${environment}-define-auth-challenge-fn`,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../resources/lambda/define-auth-challenge'), { exclude: ['*.ts'] }),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: cdk.Duration.seconds(30)
        });

        // Lambda Functions | Create Auth challenge
        const createAuthChallengeFn = new lambda.Function(this, 'CreateAuthChallenge', {
            functionName: `${environment}-create-auth-challenge-fn`,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../resources/lambda/create-auth-challenge'), { exclude: ['*.ts'] }),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: cdk.Duration.seconds(30),
            environment: {
                SES_FROM_ADDRESS: `no-reply@verificationemail.com`, //[TODO]: update from address
            }
        });

        // Lambda Functions | Verify Auth challenge response
        const verifyAuthChallengeResponseFn = new lambda.Function(this, 'VerifyAuthChallengeResponse', {
            functionName: `${environment}-verify-auth-challenge-response-fn`,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../resources/lambda/verify-auth-challenge-response'), { exclude: ['*.ts'] }),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: cdk.Duration.seconds(30)
        });

        // Lambda Functions | Pre signup
        const preSignUpFn = new lambda.Function(this, 'PreSignUp', {
            functionName: `${environment}-pre-sign-up-fn`,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../resources/lambda/pre-sign-up'), { exclude: ['*.ts'] }),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: cdk.Duration.seconds(30)
        });

        // Create IAM Role for PostAuthentication
        const postAuthRole = new iam.Role(this, 'PostAuthenticationRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
        });

        // Create IAM Policy for PostAuthentication function role to update user attributes
        const setUserAttributesPolicy = new iam.Policy(this, 'SetUserAttributesPolicy', {
            statements: [
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['cognito-idp:AdminUpdateUserAttributes'],
                resources: [this.formatArn({
                    service: 'cognito-idp',
                    resource: `userpool`,
                    resourceName: userPoolName.valueAsString
                })],
            }),
            ],
        });

        // Assign the IAM Policy to the PostAuthentication function role
        postAuthRole.attachInlinePolicy(setUserAttributesPolicy);

        // Lambda Functions | Post Authentication
        const postAuthenticationFn = new lambda.Function(this, 'PostAuthentication', {
            functionName: `${environment}-post-authentication-fn`,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../resources/lambda/post-authentication'), { exclude: ['*.ts'] }),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: cdk.Duration.seconds(30),
            role: postAuthRole
        });
        
        // Create user pool
        const userPool = new cognito.UserPool(this, 'AppCognitoUserPool', {
            userPoolName: userPoolName.valueAsString,
            selfSignUpEnabled: true,
            signInAliases: {
                email: true
            },
            autoVerify: {
                email: true
            },
            keepOriginal: {
                email: true
            },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireDigits: false,
                requireUppercase: false,
                requireSymbols: false
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            // removalPolicy: cdk.RemovalPolicy.RETAIN, // NOTE: Removal Policy is set to retain for demo purposes
            lambdaTriggers: {
                defineAuthChallenge: defineAuthChallengeFn,
                createAuthChallenge: createAuthChallengeFn,
                verifyAuthChallengeResponse: verifyAuthChallengeResponseFn,
                preSignUp: preSignUpFn,
                postAuthentication: postAuthenticationFn
            }
        });

        // Create user pool app client
        const appClient = userPool.addClient('AppCognitoUserPoolAppClient', {
            userPoolClientName: `${environment}-user-pool-app-client`,
            generateSecret: false,
            authFlows: {
                custom: true
            },
            enableTokenRevocation: true,
            accessTokenValidity: cdk.Duration.minutes(60),
            idTokenValidity: cdk.Duration.minutes(60),
            refreshTokenValidity: cdk.Duration.days(30)
        });

        this.userPool = userPool;

        new cdk.CfnOutput(this, `AppCognitoUserPoolIdOutput`, {
            description: `Cognito User Pool ID`,
            value: userPool.userPoolId
        });

        new cdk.CfnOutput(this, `AppCognitoUserPoolAppClientIdOutput`, {
            description: `Cognito User Pool App Client ID`,
            value: appClient.userPoolClientId
        });
    }
}
