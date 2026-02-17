import { clients } from '../../../lib/Clients.mjs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import z from "zod";
import {ErrorManager} from "../../../errors/errorManager.mjs";
import {Logger} from "@aws-lambda-powertools/logger";
import {toDomainAppointment} from "../../../utils/toDomainAppointment.mjs";

const getAppointments = z.object({
  userId: z.string(),
  appointmentDate: z.string(),
})

const logger = new Logger({ serviceName: 'showAppointments' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { userId, appointmentDate } = getAppointments.parse(event.pathParameters);
    const pk = `DATE#${appointmentDate}USER#${userId}`;

    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointmentsTable",
      ScanIndexForward: true,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeValues: { ":pk": pk },
      ExpressionAttributeNames: { "#pk": "PK" }});
  
    const { Items: items } = await clients.dynamoClient.send(getDynamoCommand);

   const toDomainAppointments = items && items.map(toDomainAppointment);

    return {
      statusCode: 201,
      body: JSON.stringify(toDomainAppointments),
    };
    
  } catch (e) {
    return errorHandler(e);
  }
}
