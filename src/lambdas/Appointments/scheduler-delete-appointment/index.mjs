import { clients } from '../../../lib/Clients.mjs';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const deleteAppointmentSchema = z.object({
  userId: z.string(),
  appointmentId: z.string(),
  appointmentDate: z.string(),
});

const logger = new Logger({ serviceName: 'deleteAppointment' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {
  
  try {
    const { userId, appointmentId, appointmentDate } = deleteAppointmentSchema.parse(JSON.parse(event.body));

    const deleteDynamoCommand = new DeleteCommand({
      TableName: 'SAppointmentsTable',
      Key: {
        PK: `DATE#${appointmentDate}USER#${userId}`,
        SK: `APPO#${appointmentId}`
      }
    });
  
    await clients.dynamoClient.send(deleteDynamoCommand);
    
    return {
      statusCode: 204,
      body: null,
    };

  } catch (error) {
    const errorResponse = errorHandler(error);
    return errorResponse;
  }

}
