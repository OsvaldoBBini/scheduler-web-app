import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export const clients = {
  // dynamoClient: new DynamoDBClient()
  dynamoClient: new DynamoDBClient()
}

export async function handler(event) {

  // const { name, phoneNumber } = JSON.parse(event.body);  

  console.log(clients);

  return {
    statusCode: 200,
    body: clients.dynamoClient,
  };
}