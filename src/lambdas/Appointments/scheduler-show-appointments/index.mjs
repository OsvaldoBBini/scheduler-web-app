import { clients } from '../../../lib/Clients.mjs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function handler(event) {
  
  const { userId, appointmentDate } = event.pathParameters;

  try {

    const pk = `DATE#${appointmentDate}USER#${userId}`;

    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointmentsTable",
      ScanIndexForward: true,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeValues: {
        ":pk": pk
      },
      ExpressionAttributeNames: {
        "#pk": "PK"
      }});
  
    const appointments = await clients.dynamoClient.send(getDynamoCommand);

    return {
      statusCode: 201,
      body: JSON.stringify(appointments),
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
