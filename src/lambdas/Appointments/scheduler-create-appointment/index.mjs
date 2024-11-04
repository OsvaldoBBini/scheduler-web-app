import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { clients } from '../../../lib/Clients.mjs'

export async function handler(event) {
  
  const { 
          userId,
          appointmentDate,
          name,
          phoneNumber,
          startsAt,
          endsAt,
          appointmentType,
          appointmentPayment} = JSON.parse(event.body);
  
  try {
    
    const pk = `DATE#${appointmentDate}USER#${userId}`;
    const sk = `APPO#${randomUUID()}`;
    
    // const getDynamoCommand = new QueryCommand({
    //   TableName: "SAppointmentsTable",
    //   ScanIndexForward: true,
    //   KeyConditionExpression: "#pk = :pk",
    //   ExpressionAttributeValues: {
    //     ":pk": pk
    //   },
    //   ExpressionAttributeNames: {
    //     "#pk": "PK"
    //   }});
      
    // const appointments = await clients.dynamoClient.send(getDynamoCommand);
    
    // const verifyAppointments = appointments.Items.filter(({ startsAt: startN , endsAt: endN }) => {
    //   const start = Number(startN);
    //   const end = Number(endN);
    
    //   const newAppointmentOverlaps = 
    //     (startsAt >= start && startsAt < end) ||   
    //     (endsAt > start && endsAt <= end) ||       
    //     (startsAt <= start && endsAt >= end);     
        
    //     return newAppointmentOverlaps;
    //   });
      
    //   if(verifyAppointments.length) {
    //     return {
    //       statusCode: 409,
    //       body: JSON.stringify({
    //         error: 'An appointment already exists for this date.'
    //       }),
    //     };
    //   };
    
    const putDynamoCommand = new PutCommand({
      TableName: 'SAppointmentsTable',
      Item: {
        PK:  pk,
        SK: sk,
        name: name,
        phoneNumber: phoneNumber,
        startsAt: startsAt,
        endsAt: endsAt,
        appointmentType: appointmentType,
        appointmentPayment: appointmentPayment
      },
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

    return {
      statusCode: 500,
      body: JSON.stringify({'error': 'Internal server error'})
    }
  }

}