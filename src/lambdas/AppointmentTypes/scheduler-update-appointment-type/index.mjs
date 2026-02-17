import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { clients } from '../../../lib/Clients.mjs';
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const updateAppointmentTypePathParams = z.object({
  userId: z.string()
});

const updateAppointmentTypeSchema = z.object({
  appointmentTypeName: z.string(),
  appointmentTypePrice: z.string(),
});

const logger = new Logger({ serviceName: 'updateAppointmentType' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { userId } = updateAppointmentTypePathParams.parse(event.pathParameters); 
    const { appointmentTypeId } = event.queryStringParameters;
    const pk = `USER#${userId}`;

    const { appointmentTypeName, appointmentTypePrice } = updateAppointmentTypeSchema.parse(JSON.parse(event.body));

    const updateDynamoCommand = new UpdateCommand({
      TableName: 'SAppointmentsTable',
      Key: {
        PK: pk,
        SK: `TYPE#${appointmentTypeId}`
      },
      ExpressionAttributeNames: {
        "#appointmentTypeName": "appointmentTypeName",
        "#appointmentTypePrice": "appointmentTypePrice"
      },
      ExpressionAttributeValues: {
        ":appointmentTypeName": appointmentTypeName,
        ":appointmentTypePrice": appointmentTypePrice,
      },
      UpdateExpression: "SET #appointmentTypeName = :appointmentTypeName, #appointmentTypePrice = :appointmentTypePrice"
    });
  
    await clients.dynamoClient.send(updateDynamoCommand);
    
    return {
      statusCode: 204,
      body: null,
    };
    
  } catch (error) {
    return errorHandler(error);
  }

}