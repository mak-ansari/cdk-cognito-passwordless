import { PostAuthenticationTriggerHandler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cisp = new CognitoIdentityServiceProvider();

export const handler: PostAuthenticationTriggerHandler = async event => {
    if (event.request.userAttributes.email_verified !== 'true') {
        const params: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest = {
            UserPoolId: event.userPoolId,
            UserAttributes: [{
                Name: 'email_verified',
                Value: 'true',
            }],
            Username: event.userName!,
        };
        await cisp.adminUpdateUserAttributes(params).promise();
    }
    return event;
};