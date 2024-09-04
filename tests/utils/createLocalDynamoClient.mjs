import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export function createLocalDynamoClient() {

  const client = new DynamoDBClient(
    {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      credentials : {
        accessKeyId: '2uz49p',
        secretAccessKey: 'c7g4g'
      }
    });
  
  const clients = DynamoDBDocumentClient.from(client);

  return clients;
};
