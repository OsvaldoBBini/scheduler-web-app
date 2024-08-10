import { DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../lib/Cients.mjs';

export async function handler(event) {
  
  const { userId } = event.queryStringParameters;
  const { appointmentId } = JSON.parse(event.body);

  try {
    const deleteDynamoCommand = new DeleteItemCommand({
      TableName: 'SAppointments',
      Key: {
        userId: { S: userId },
        appointmentId: { S: appointmentId }
      }
    });
  
    await clients.dynamoClient.send(deleteDynamoCommand);
  } catch (error) {
    console.log({
      user: userId,
      data: new Date(),
      message: error.meassage,
      name: error.name,
      instanceType: error.constructor.name
    });
  }

  return {
    statusCode: 204,
    body: null,
  };
}
