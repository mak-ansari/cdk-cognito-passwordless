import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as AppRootStack from '../lib/app-root-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/aws-infra-cdk-stack.ts
test('CognitoStack Created', () => {
    // const app = new cdk.App();
    // // WHEN
    // const stack = new AppRootStack.AppCognitoStack(app, 'MyTestStack');
    // // THEN
    // const template = Template.fromStack(stack);

    // template.hasResourceProperties('AWS::Cognito::UserPool', {
    //     UserPoolName: "sample-test-user-pool"
    // });
});
