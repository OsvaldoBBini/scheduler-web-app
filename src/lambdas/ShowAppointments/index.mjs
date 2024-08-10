import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../lib/Cients.mjs';

export async function handler(event) {
  
  const { userId, appointmentDate } = event.queryStringParameters;

  try {
    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointments",
      ScanIndexForward: true,
      KeyConditionExpression: "#userId = :userId",
      FilterExpression: "#appointmentDate = :appointmentDate",
      ExpressionAttributeValues: {
        ":appointmentDate": {
          "S": appointmentDate
        },
        ":userId": {
          "S": userId
        }
      },
      ExpressionAttributeNames: {
        "#appointmentDate": "appointmentDate",
        "#userId": "userId"
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
      message: error.meassage,
      name: error.name,
      instanceType: error.constructor.name
    });
  }
}
