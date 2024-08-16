import { DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../../../lib/Clients.mjs';

export async function handler(event) {
  
  const { userId } = event.queryStringParameters;
  const { appointmentTypeId } = JSON.parse(event.body);

  try {
    const deleteDynamoCommand = new DeleteItemCommand({
      TableName: 'SAppointmentTypes',
      Key: {
        userId: { S: userId },
        appointmentTypeId: { S: appointmentTypeId }
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
