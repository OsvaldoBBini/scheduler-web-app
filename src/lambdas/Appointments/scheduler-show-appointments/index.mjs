import { clients } from '../../../lib/Clients.mjs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import z from "zod";
import {ErrorManager} from "../../../errors/errorManager.mjs";
import {Logger} from "@aws-lambda-powertools/logger";

const getAppointments = z.object({
  userId: z.string(),
  appointmentDate: z.string(),
})

const logger = new Logger({ serviceName: 'createAppointment' });
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

    const toDomainAppointments = items && items.map(appointment => {

      const splitedPk = appointment.PK.split('#');
      const userId = splitedPk[3];
      const appointmentDate = splitedPk[1];

      return {
        userId: userId,
        appointmentDate: appointmentDate,
        appointmentId: appointment.SK.split('#')[-1],
        name: appointment.name,
        contact: appointment.contact,
        startAt: appointment.startAt,
        endsAt: appointment.endsAt,
        appointmentType: appointment.appointmentType,
        appointmentPayment: appointment.appointmentPayment,
      }
    });

    return {
      statusCode: 201,
      body: JSON.stringify(toDomainAppointments),
    };
    
  } catch (e) {
    return errorHandler(e);
  }
}
