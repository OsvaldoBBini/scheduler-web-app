import { clients } from '../../../lib/Clients.mjs'
import { QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';

export async function handler(event) {

  const { appointmentDate } = event.pathParameters;

  const { newAppointmentDate,
          userId,
          appointmentId,
          name,
          phoneNumber,
          startsAt,
          endsAt,
          appointmentType,
          confirmed,
          appointmentPayment } = JSON.parse(event.body);
          
  try {

    const pk = `DATE#${newAppointmentDate ? newAppointmentDate : appointmentDate}`;
    const sk = newAppointmentDate ? `APPO#${randomUUID()}` : `APPO#${appointmentId}`;
    const gsi1pk = `USER#${userId}`;

    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointmentsTable",
      ScanIndexForward: true,
      KeyConditionExpression: "#pk = :pk",
      FilterExpression: "#gsi1pk = :gsi1pk",
      ExpressionAttributeValues: {
        ":gsi1pk": gsi1pk,
        ":pk": pk
      },
      ExpressionAttributeNames: {
        "#gsi1pk": "GSI1PK",
        "#pk": "PK"
      }});

    const appointments = await clients.dynamoClient.send(getDynamoCommand);

    const verifyAppointments = appointments.Items
    .filter(({ SK: id }) => id !== appointmentId)
    .filter(({ startsAt: startN, endsAt: endN }) => {
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
    
    const putDynamoCommand = new PutCommand({
        TableName: 'SAppointmentsTable',
        Item: {
          PK:  pk,
          SK: sk,
          GSI1PK: gsi1pk,
          GSI1SK: sk,
          name: name,
          phoneNumber: phoneNumber,
          startsAt: startsAt,
          endsAt: endsAt,
          appointmentType: appointmentType,
          confirmed: confirmed,
          appointmentPayment: appointmentPayment
        },
      });
      
    await clients.dynamoClient.send(putDynamoCommand);
      
    if (newAppointmentDate && newAppointmentDate !== appointmentDate) {

      const deleteDynamoCommand = new DeleteCommand({
        TableName: 'SAppointmentsTable',
        Key: {
          PK: `DATE#${appointmentDate}`,
          SK: `APPO#${appointmentId}`
        }
      });
    
      await clients.dynamoClient.send(deleteDynamoCommand);

    }

    return {
      statusCode: 204,
      body: null,
    };
    
  } catch (error) {

    console.log({
      user: userId,
      data: new Date(),
      message: error.message,
      name: error.name,
      instanceType: error.constructor.name
    });

    return {
      statusCode: 500,
      body: JSON.stringify({'error': 'Internal server error'})
    }
  }

}