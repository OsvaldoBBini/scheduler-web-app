import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { clients } from '../../../lib/Clients.mjs';
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const createAppointmentTypePathParams = z.object({
  userId: z.string()
});

const createAppointmentTypeSchema = z.object({
  appointmentTypeName: z.string(),
  appointmentTypePrice: z.number().positive(),
});

const logger = new Logger({ serviceName: 'createAppointmentType' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { userId } = createAppointmentTypePathParams.parse(event.pathParameters);
    const pk = `USER#${userId}`;

    const { 
      appointmentTypeName,
      appointmentTypePrice
    } = createAppointmentTypeSchema.parse(JSON.parse(event.body));

    const appointmentTypeId = randomUUID();

    const putDynamoCommand = new PutCommand({
      TableName: 'SAppointmentsTable',
      Item: {
        PK: pk,
        SK: `TYPE#${appointmentTypeId}`,
        appointmentTypeName: appointmentTypeName,
        appointmentTypePrice: appointmentTypePrice,
      },
    });
  
    await clients.dynamoClient.send(putDynamoCommand);
    
    return {
      statusCode: 201,
      body: JSON.stringify({ appointmentTypeId }),
    };
    
  } catch (error) {
    return errorHandler(error);
  }

}