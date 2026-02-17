import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { clients } from '../../../lib/Clients.mjs';
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const showAppointmentTypePathParams = z.object({
  userId: z.string()
});

const logger = new Logger({ serviceName: 'showAppointmentType' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {
  
  try {
    const { userId } = showAppointmentTypePathParams.parse(event.pathParameters);
    const pk = `USER#${userId}`;

    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointmentsTable",
      ScanIndexForward: true,
      KeyConditionExpression: "#userId = :userId AND begins_with(#type, :type)",
      ExpressionAttributeValues: {
        ":userId": pk,
        ":type": "TYPE#"
      },
      ExpressionAttributeNames: {
        "#userId": "PK",
        "#type": "SK"
      }});
  
    const { Items: items } = await clients.dynamoClient.send(getDynamoCommand);

    const toDomainAppointmentsTypes = items && items.map(item => ({
      appointmentTypeId: item.SK.replace("TYPE#", ""),
      appointmentTypeName: item.appointmentTypeName,
      appointmentTypePrice: item.appointmentTypePrice
    }));
  
    return {
      statusCode: 200,
      body: JSON.stringify(toDomainAppointmentsTypes),
    };
  } catch (error) {
    return errorHandler(error);
  }
}
