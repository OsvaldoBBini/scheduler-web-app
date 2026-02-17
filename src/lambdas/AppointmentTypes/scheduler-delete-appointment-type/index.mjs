import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { clients } from '../../../lib/Clients.mjs';
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const deleteAppointmentTypePathParams = z.object({
  userId: z.string()
});

const deleteAppointmentTypeSchema = z.object({
  appointmentTypeId: z.string(),
});

const logger = new Logger({ serviceName: 'deleteAppointmentType' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {
  
  try {
    const { userId } = deleteAppointmentTypePathParams.parse(event.pathParameters);
    const pk = `USER#${userId}`;

    const { appointmentTypeId } = deleteAppointmentTypeSchema.parse(JSON.parse(event.body));

    const deleteDynamoCommand = new DeleteCommand({
      TableName: 'SAppointmentsTable',
      Key: {
        PK: pk,
        SK: `TYPE#${appointmentTypeId}`
      }
    });
    
    await clients.dynamoClient.send(deleteDynamoCommand);
    
    return {
      statusCode: 204,
      body: null,
    };
    
  } catch (error) {
    return errorHandler(error);
  }

}
