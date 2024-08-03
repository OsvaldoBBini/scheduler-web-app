import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'

export const clients = {
  dynamoClient: new DynamoDBClient(),
};

export async function handler(event) {
  
  const { userId } = event.queryStringParameters;
  const { appointmentId } = JSON.parse(event.body);

  const deleteDynamoCommand = new DeleteItemCommand({
    TableName: 'SAppointments',
    Key: {
      userId: { S: userId },
      appointmentId: { S: appointmentId }
    }
  })

  await clients.dynamoClient.send(deleteDynamoCommand);

  return {
    statusCode: 204,
    body: null,
  };
}
