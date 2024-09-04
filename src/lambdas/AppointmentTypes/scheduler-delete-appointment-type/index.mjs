import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { clients } from '../../../lib/Clients.mjs';

export async function handler(event) {
  
  const { userId } = event.pathParameters;
  const pk = `USER#${userId}`;

  const { appointmentTypeId } = JSON.parse(event.body);

  try {
    const deleteDynamoCommand = new DeleteCommand({
      TableName: 'SAppointments',
      Key: {
        GSI1PK: pk,
        GSI1SK: appointmentTypeId
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
