import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();

export const clients = {
  dynamoClient: DynamoDBDocumentClient.from(client)
};