import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { randomUUID } from 'node:crypto';
import { clients } from '../lib/Clients.mjs'

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

      const verifyAppointments = appointments.Items.filter(({ startsAt: { N: startN }, endsAt: { N: endN } }) => {
        const start = Number(startN);
        const end = Number(endN);
      
        const newAppointmentOverlaps = 
          (startsAt >= start && startsAt < end) ||   
          (endsAt > start && endsAt <= end) ||       
          (startsAt <= start && endsAt >= end);     

        return newAppointmentOverlaps;
      });

      if(verifyAppointments.length) {
        return {
          statusCode: 409,
          body: JSON.stringify({
            error: 'An appointment already exists for this date.'
          }),
        };
      };

    const appointmentId = randomUUID();
    const putDynamoCommand = new PutItemCommand({
      TableName: 'SAppointments',
      Item: {
        userId: { S: userId },
        appointmentId: { S: appointmentId },
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
  } catch (error) {
    console.log({
      user: userId,
      data: new Date(),
      message: error.message,
      name: error.name,
      instanceType: error.constructor.name
    });
  }

  return {
    statusCode: 204,
    body: null,
  };
}