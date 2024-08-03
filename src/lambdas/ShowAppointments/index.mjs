import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'

export const clients = {
  dynamoClient: new DynamoDBClient(),
};

export async function handler(event) {
  
  const { userId, appointmentDate } = event.queryStringParameters;

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
}
