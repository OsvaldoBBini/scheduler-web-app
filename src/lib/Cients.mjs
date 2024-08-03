import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export const clients = {
  dynamoClient: new DynamoDBClient(),
};