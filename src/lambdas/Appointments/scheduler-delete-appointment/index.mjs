import { clients } from '../../../lib/Clients.mjs';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

export async function handler(event) {
  
  const { userId, appointmentId, appointmentDate } = JSON.parse(event.body);

  try {
    const deleteDynamoCommand = new DeleteCommand({
      TableName: 'SAppointmentsTable',
      Key: {
        PK: `DATE#${appointmentDate}USER#${userId}`,
        SK: `APPO#${appointmentId}`
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

    return {
      statusCode: 500,
      body: JSON.stringify({'error': 'Internal server error'})
    }

  }

}
