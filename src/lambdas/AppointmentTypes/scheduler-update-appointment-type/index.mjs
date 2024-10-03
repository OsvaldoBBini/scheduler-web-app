import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { clients } from '../../../lib/Clients.mjs'

export async function handler(event) {

  const { userId } = event.pathParameters; 
  const { appointmentTypeId } = event.queryStringParameters;
  const pk = `USER${userId}`;

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

    const putDynamoCommand = new UpdateCommand({
      TableName: 'SAppointmentsTable',
      Key: {
        PK: pk,
        SK: appointmentTypeId
      },
      ExpressionAttributeNames: {
        "#appointmentTypeName": "appointmentTypeName",
        "#appointmentTypePrice": "appointmentTypePrice"
      },
      ExpressionAttributeValues: {
        ":appointmentTypeName": appointmentTypeName,
        ":appointmentTypePrice": appointmentTypePrice,
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