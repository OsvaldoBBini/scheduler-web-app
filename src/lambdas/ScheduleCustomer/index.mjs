import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { v4 } from 'uuid';

export const clients = {
  dynamoClient: new DynamoDBClient(),
};

export async function handler(event) {

  const { userId,
          appointmentDate,
          name,
          phoneNumber,
          startsAt,
          endsAt,
          appointmentType,
          confirmed,
          appointmentPayment} = JSON.parse(event.body);

  if ([appointmentDate, name, phoneNumber, startsAt, endsAt, appointmentType].includes(undefined)) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Some fields are missing'
      }),
    };
  };

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

  const verifyAppointments = appointments.Items.filter(appointment => 
    (appointment.startsAt.N < startsAt < appointment.endsAt.N) || 
    (appointment.startsAt.N < endsAt < appointment.endsAt.N) || 
    (appointment.startsAt.N === startsAt) ||
    (appointment.endsAt.N === endsAt)
  );

  if(verifyAppointments.length) {
    return {
      statusCode: 409,
      body: JSON.stringify({
        error: 'An appointment already exists for this date.'
      }),
    };
  };

  const putDynamoCommand = new PutItemCommand({
    TableName: 'SAppointments',
    Item: {
      userId: { S: userId },
      appointmentId: { S: v4() },
      appointmentDate: { S: appointmentDate },
      name: { S: name },
      phoneNumber: { S: phoneNumber },
      startsAt: { N: startsAt },
      endsAt: { N: endsAt },
      appointmentType: { S: appointmentType },
      confirmed: { BOOL: confirmed },
      appointmentPayment: { N: appointmentPayment }
    },
  });

  await clients.dynamoClient.send(putDynamoCommand);

  return {
    statusCode: 204,
    body: null,
  };
}