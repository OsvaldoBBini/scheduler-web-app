import { QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { clients } from '../../../lib/Clients.mjs'

export async function handler(event) {

  const { userEmail, appointmentId } = event.queryStringParameters;
  const pk = `USER#${userEmail}`;

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

      const verifyAppointments = appointments.Items
      .filter(({ GSI1SK: {S: id} }) => id !== appointmentId)
      .filter(({ startsAt: { N: startN }, endsAt: { N: endN } }) => {
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

    const putDynamoCommand = new UpdateItemCommand({
      TableName: 'SAppointments',
      Key: {
        GSI1PK: { S: pk },
        GSI1SK: { S: appointmentId }
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
        ":appointmentDate": { S: appointmentDate },
        ":name": { S: name },
        ":phoneNumber": { S: phoneNumber },
        ":startsAt": { N: startsAt },
        ":endsAt": { N: endsAt },
        ":appointmentType": { S: appointmentType },
        ":confirmed": { BOOL: confirmed },
        ":appointmentPayment": { N: appointmentPayment }
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
      user: userEmail,
      data: new Date(),
      message: error.message,
      name: error.name,
      instanceType: error.constructor.name
    });
  }

}