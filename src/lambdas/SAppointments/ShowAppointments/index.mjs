import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../../../lib/Clients.mjs';

export async function handler(event) {
  
  const { userEmail, appointmentDate } = event.queryStringParameters;
  const pk = `USER#${userEmail}`;

  try {
    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointments",
      ScanIndexForward: true,
      KeyConditionExpression: "#userEmail = :userEmail",
      FilterExpression: "#appointmentDate = :appointmentDate",
      ExpressionAttributeValues: {
        ":appointmentDate": {
          "S": appointmentDate
        },
        ":userEmail": {
          "S": pk
        }
      },
      ExpressionAttributeNames: {
        "#appointmentDate": "appointmentDate",
        "#userEmail": "GSI1PK"
      }});
  
    const appointments = await clients.dynamoClient.send(getDynamoCommand);
  
    return {
      statusCode: 201,
      body: JSON.stringify(appointments),
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
