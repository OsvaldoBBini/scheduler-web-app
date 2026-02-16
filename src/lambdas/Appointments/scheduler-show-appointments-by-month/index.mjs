import { clients } from '../../../lib/Clients.mjs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import z from "zod";
import {ErrorManager} from "../../../errors/errorManager.mjs";
import {Logger} from "@aws-lambda-powertools/logger";
import { toDomainAppointment } from '../../../utils/toDomainAppointment.mjs';

const getAppointments = z.object({
  userId: z.string(),
  month: z.string(),
  year: z.string(),
})

const logger = new Logger({ serviceName: 'createAppointment' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { userId, month, year } = getAppointments.parse(event.pathParameters);

    const gsi1pk = `APPOINTMENT#USERID#${userId}`;
    const gsi1sk = `MONTH#${month}#YEAR#${year}`;

    const getDynamoCommand = new QueryCommand({
      TableName: "SAppointmentsTable",
      IndexName: "GSI1",
      ScanIndexForward: true,
      KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
      ExpressionAttributeValues: { 
        ":gsi1pk": gsi1pk,
        ":gsi1sk": gsi1sk
      },
      ExpressionAttributeNames: { 
        "#gsi1pk": "GSI1PK",
        "#gsi1sk": "GSI1SK"
      }
    });
  
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
