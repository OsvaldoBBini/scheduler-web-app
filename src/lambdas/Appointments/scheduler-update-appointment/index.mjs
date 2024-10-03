import { clients } from '../../../lib/Clients.mjs'
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function handler(event) {

  const { userId } = event.pathParameters;
  const { appointmentId } = event.queryStringParameters;
  const pk = `USER#${userId}`;

  const { appointmentDate,
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
      TableName: "SAppointmentsTable",
      ScanIndexForward: true,
      KeyConditionExpression: "#userId = :userId",
      FilterExpression: "#appointmentDate = :appointmentDate",
      ExpressionAttributeValues: {
        ":appointmentDate": appointmentDate,
        ":userId": pk
      },
      ExpressionAttributeNames: {
        "#appointmentDate": "appointmentDate",
        "#userId": "PK"
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

    const putDynamoCommand = new UpdateCommand({
      TableName: 'SAppointmentsTable',
      Key: {
        PK: pk,
        SK: appointmentId
      },
      ExpressionAttributeNames: {
        "#appointmentDate": "appointmentDate",
        "#name": "name",
        "#phoneNumber": "phoneNumber",
        "#startsAt": "startsAt",
        "#endsAt": "endsAt",
        "#appointmentType": "appointmentType",
        "#confirmed": "confirmed",
        "#appointmentPayment": "appointmentPayment",
      },
      ExpressionAttributeValues: {
        ":appointmentDate": appointmentDate,
        ":name": name,
        ":phoneNumber": phoneNumber,
        ":startsAt":  startsAt,
        ":endsAt":  endsAt,
        ":appointmentType": appointmentType,
        ":confirmed": confirmed,
        ":appointmentPayment":  appointmentPayment
      },
      UpdateExpression: "SET #appointmentDate = :appointmentDate, #name = :name, #phoneNumber = :phoneNumber, #startsAt = :startsAt, #endsAt = :endsAt, #appointmentType = :appointmentType, #confirmed = :confirmed, #appointmentPayment = :appointmentPayment"
    });
  
    await clients.dynamoClient.send(putDynamoCommand);
    
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
  }

}