import { UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../../../lib/Clients.mjs'

export async function handler(event) {

  const { userId, appointmentTypeId } = event.queryStringParameters;
  const { appointmentTypeName, appointmentTypePrice } = JSON.parse(event.body);

  if ([appointmentTypeName, appointmentTypePrice].includes(undefined)) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Some fields are missing'
      }),
    };
  };

  try {

    const putDynamoCommand = new UpdateItemCommand({
      TableName: 'SAppointmentTypes',
      Key: {
        userId: { S: userId },
        appointmentTypeId: { S: appointmentTypeId }
      },
      ExpressionAttributeNames: {
        "#appointmentTypeName": "appointmentTypeName",
        "#appointmentTypePrice": "appointmentTypePrice"
      },
      ExpressionAttributeValues: {
        ":appointmentTypeName": { S: appointmentTypeName },
        ":appointmentTypePrice": { S: appointmentTypePrice },
      },
      UpdateExpression: "SET #appointmentTypeName = :appointmentTypeName, #appointmentTypePrice = :appointmentTypePrice"
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