import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export function createLocalDynamoClient() {

  const clients = new DynamoDBClient(
    {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      credentials : {
        accessKeyId: '2uz49p',
        secretAccessKey: 'c7g4g'
      }
    });

  return clients;
};
