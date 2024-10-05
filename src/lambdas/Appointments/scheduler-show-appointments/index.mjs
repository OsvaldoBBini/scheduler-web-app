import { clients } from '../../../lib/Clients.mjs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function handler(event) {
  
  const { appointmentDate } = event.pathParameters;
  const { userId } = event.queryStringParameters;

  try {

    const pk = `DATE#${appointmentDate}`;
    const gsi1pk = `USER#${userId}`;

    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointmentsTable",
      ScanIndexForward: true,
      KeyConditionExpression: "#pk = :pk",
      FilterExpression: "#gsi1pk = :gsi1pk",
      ExpressionAttributeValues: {
        ":gsi1pk": gsi1pk,
        ":pk": pk
      },
      ExpressionAttributeNames: {
        "#gsi1pk": "GSI1PK",
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
