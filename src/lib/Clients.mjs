import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const client = new DynamoDBClient();

export const clients = {
  dynamoClient: DynamoDBDocumentClient.from(client),
  cognitoClient: new CognitoIdentityProviderClient()
};