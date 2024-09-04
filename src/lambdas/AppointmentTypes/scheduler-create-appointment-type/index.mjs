import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { randomUUID } from 'node:crypto';
import { clients } from '../../../lib/Clients.mjs'

export async function handler(event) {

  const { userEmail } = event.queryStringParameters;
  const pk = `USER#${userEmail}`;

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

    const putDynamoCommand = new PutItemCommand({
      TableName: 'SAppointments',
      Item: {
        GSI1PK: { S: pk },
        GSI1SK: { S: `TYPE#${appointmentTypeId}` },
        appointmentTypeName: { S: appointmentTypeName },
        appointmentTypePrice: { S: appointmentTypePrice },
      },
    });
  
    await clients.dynamoClient.send(putDynamoCommand);
    
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