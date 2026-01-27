import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { clients } from '../../../lib/Clients.mjs'
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod'

const createAppointmentSchema = z.object({
  userId: z.string(),
  appointmentDate: z.string(),
  name: z.string(),
  contact: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  appointmentType: z.string(),
  appointmentPayment: z.string(),
});

const logger = new Logger({ serviceName: 'createAppointment' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {
  
  
  try {
    const { 
      userId,
      appointmentDate,
      name,
      contact,
      startsAt,
      endsAt,
      appointmentType,
      appointmentPayment } = createAppointmentSchema.parse(JSON.parse(event.body));
    
    const pk = `DATE#${appointmentDate}USER#${userId}`;
    const sk = `APPO#${randomUUID()}`;
    
    const putDynamoCommand = new PutCommand({
      TableName: 'SAppointmentsTable',
      Item: {
        PK: pk,
        SK: sk,
        GSI1PK: 'APPOINTMENT',
        GSI1SK: appointmentDate,
        name: name,
        contact: contact,
        startsAt: startsAt,
        endsAt: endsAt,
        appointmentType: appointmentType,
        appointmentPayment: appointmentPayment,
        appointmentDate: appointmentDate
      },
    });
  
    await clients.dynamoClient.send(putDynamoCommand);
    
    return {
      statusCode: 204,
      body: null,
    };

  } catch (e) {
    const errorResponse = errorHandler(e);
    return errorResponse;
  }

}