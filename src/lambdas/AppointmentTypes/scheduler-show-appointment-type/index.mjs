import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../../../lib/Clients.mjs';

export async function handler(event) {
  
  const { userEmail } = event.queryStringParameters;
  const pk = `USER#${userEmail}`;

  try {
    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointments",
      ScanIndexForward: true,
      KeyConditionExpression: "#userEmail = :userEmail AND begins_with(#type, :type)",
      ExpressionAttributeValues: {
        ":userEmail": {
          "S": pk
        },
        ":type": { "S": "TYPE#" }
      },
      ExpressionAttributeNames: {
        "#userEmail": "GSI1PK",
        "#type": "GSI1SK"
      }});
  
    const appointmentTypes = await clients.dynamoClient.send(getDynamoCommand);
  
    return {
      statusCode: 201,
      body: JSON.stringify(appointmentTypes),
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
