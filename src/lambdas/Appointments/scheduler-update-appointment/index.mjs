import { clients } from '../../../lib/Clients.mjs'
import { PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import z from 'zod';
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';

const updateAppointmentPathParametersSchema = z.object({
  userId: z.string(),
  appointmentDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/)
})

const updateAppointmentBodySchema = z.object({
  newAppointmentDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
  appointmentId: z.string(),
  name: z.string(),
  contact: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  appointmentType: z.string(),
  appointmentPayment: z.number().positive(), 
})

const logger = new Logger({ serviceName: 'updateAppointment' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {

    const { userId, appointmentDate } = updateAppointmentPathParametersSchema.parse(event.pathParameters);
  
    const { newAppointmentDate,
            appointmentId,
            name,
            contact,
            startsAt,
            endsAt,
            appointmentType,
            appointmentPayment } = updateAppointmentBodySchema.parse(JSON.parse(event.body));
    
    const pk = `DATE#${newAppointmentDate !== appointmentDate ? newAppointmentDate : appointmentDate}USER#${userId}`;
    const sk = newAppointmentDate !== appointmentDate ? `APPO#${randomUUID()}` : `APPO#${appointmentId}`;

    const month = newAppointmentDate !== appointmentDate ? newAppointmentDate.split('-')[1] : appointmentDate.split('-')[1];
    const year = newAppointmentDate !== appointmentDate ? newAppointmentDate.split('-')[2] : appointmentDate.split('-')[2];
    const gsi1sk = `MONTH#${month}#YEAR#${year}`;
    
    const putDynamoCommand = new PutCommand({
        TableName: 'SAppointmentsTable',
        Item: {
          PK:  pk,
          SK: sk,
          GSI1SK: gsi1sk,
          name: name,
          contact: contact,
          startsAt: startsAt,
          endsAt: endsAt,
          appointmentType: appointmentType,
          appointmentPayment: appointmentPayment
        },
      });
      
    await clients.dynamoClient.send(putDynamoCommand);
      
    if (newAppointmentDate && newAppointmentDate !== appointmentDate) {

      const deleteDynamoCommand = new DeleteCommand({
        TableName: 'SAppointmentsTable',
        Key: {
          PK: `DATE#${appointmentDate}USER#${userId}`,
          SK: `APPO#${appointmentId}`
        }
      });
    
      await clients.dynamoClient.send(deleteDynamoCommand);

    }

    return {
      statusCode: 201,
      body: { appointmentId: sk },
    };
    
  } catch (e) {
    return errorHandler(e);
  }

}