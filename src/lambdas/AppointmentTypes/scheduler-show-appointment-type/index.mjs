import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { clients } from '../../../lib/Clients.mjs';

export async function handler(event) {
  
  const { userId } = event.pathParameters;
  const pk = `USER#${userId}`;

  try {
    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointmentsTable",
      ScanIndexForward: true,
      KeyConditionExpression: "#userEmail = :userEmail AND begins_with(#type, :type)",
      ExpressionAttributeValues: {
        ":userEmail": pk,
        ":type": "TYPE#"
      },
      ExpressionAttributeNames: {
        "#userEmail": "PK",
        "#type": "SK"
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
