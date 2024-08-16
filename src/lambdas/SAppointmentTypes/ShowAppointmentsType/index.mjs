import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../../../lib/Clients.mjs';

export async function handler(event) {
  
  const { userId } = event.queryStringParameters;

  try {
    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointmentTypes",
      ScanIndexForward: true,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeValues: {
        ":userId": {
          "S": userId
        }
      },
      ExpressionAttributeNames: {
        "#userId": "userId"
      }});
  
    const appointmentTypes = await clients.dynamoClient.send(getDynamoCommand);
  
    return {
      statusCode: 201,
      body: JSON.stringify(appointmentTypes),
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
