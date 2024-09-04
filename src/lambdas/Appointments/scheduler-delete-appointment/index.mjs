import { clients } from '../../../lib/Clients.mjs';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

export async function handler(event) {
  
  const { userId } = event.pathParameters;
  const pk = `USER#${userId}`;
  
  const { appointmentId } = JSON.parse(event.body);

  try {
    const deleteDynamoCommand = new DeleteCommand({
      TableName: 'SAppointments',
      Key: {
        GSI1PK: pk,
        GSI1SK: appointmentId
      }
    });
  
    await clients.dynamoClient.send(deleteDynamoCommand);
    
    return {
      statusCode: 204,
      body: null,
    };

  } catch (error) {
    console.log({
      user: userId,
      data: new Date(),
      message: error.message,
      name: error.name,
      instanceType: error.constructor.name
    });
  }

}
