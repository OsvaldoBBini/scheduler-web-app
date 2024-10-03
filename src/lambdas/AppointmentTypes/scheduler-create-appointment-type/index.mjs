import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { clients } from '../../../lib/Clients.mjs'

export async function handler(event) {

  const { userId } = event.pathParameters;
  const pk = `USER#${userId}`;

  const { 
    appointmentTypeName,
    appointmentTypePrice
  } = JSON.parse(event.body);

  if ([appointmentTypeName, appointmentTypePrice].includes(undefined)) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Some fields are missing'
      }),
    };
  };

  try {
    const appointmentTypeId = randomUUID();

    const putDynamoCommand = new PutCommand({
      TableName: 'SAppointmentsTable',
      Item: {
        PK: pk,
        SK: `TYPE#${appointmentTypeId}`,
        appointmentTypeName: appointmentTypeName,
        appointmentTypePrice: appointmentTypePrice,
      },
    });
  
    await clients.dynamoClient.send(putDynamoCommand);
    
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