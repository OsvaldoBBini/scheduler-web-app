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
  appointmentPayment: z.number().positive(),
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
    
    const pk = `DATE#${appointmentDate}#USER#${userId}`;
    const sk = `APPO#${randomUUID()}`;

    const month = appointmentDate.split('-')[1];
    const year = appointmentDate.split('-')[2];

    const gsi1sk = `MONTH#${month}#YEAR#${year}`;
    
    const putDynamoCommand = new PutCommand({
      TableName: 'SAppointmentsTable',
      Item: {
        PK: pk,
        SK: sk,
        GSI1PK: `APPOINTMENT#USER#${userId}`,
        GSI1SK: gsi1sk,
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
      statusCode: 201,
      body: { appointmentId: sk },
    };

  } catch (e) {
    return errorHandler(e);
  }

}