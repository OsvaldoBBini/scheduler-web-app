import { clients } from '../../../lib/Clients.mjs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function handler(event) {
  
  const { userId } = event.pathParameters;
  const { appointmentDate } = event.queryStringParameters;
  const pk = `USER#${userId}`;

  try {
    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointments",
      ScanIndexForward: true,
      KeyConditionExpression: "#userId = :userId",
      FilterExpression: "#appointmentDate = :appointmentDate",
      ExpressionAttributeValues: {
        ":appointmentDate": appointmentDate,
        ":userId": pk
      },
      ExpressionAttributeNames: {
        "#appointmentDate": "appointmentDate",
        "#userId": "GSI1PK"
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
  }
}
