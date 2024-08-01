import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'

export const clients = {
  dynamoClient: new DynamoDBClient(),
};

export async function handler(event) {

  const { queryStringParams } = JSON.parse(event);
  const { userId, date } = queryStringParams;

  const getDynamoCommand = new QueryCommand({
    TableName: "SAppointments",
    ScanIndexForward: true,
    KeyConditionExpression: "#userId = :userId",
    FilterExpression: "#appointmentDate = :appointmentDate",
    ExpressionAttributeValues: {
      ":appointmentDate": {
        "S": date
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
