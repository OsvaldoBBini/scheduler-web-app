import { DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../../../lib/Clients.mjs';

export async function handler(event) {
  
  const { userEmail } = event.queryStringParameters;
  const pk = `USER#${userEmail}`;

  const { appointmentTypeId } = JSON.parse(event.body);

  try {
    const deleteDynamoCommand = new DeleteItemCommand({
      TableName: 'SAppointments',
      Key: {
        GSI1PK: { S: pk },
        GSI1SK: { S: appointmentTypeId }
      }
    });
    
    await clients.dynamoClient.send(deleteDynamoCommand);
    
    return {
      statusCode: 204,
      body: null,
    };
    
  } catch (error) {
    console.log({
      user: userEmail,
      data: new Date(),
      message: error.message,
      name: error.name,
      instanceType: error.constructor.name
    });
  }

}
