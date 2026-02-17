import { clients } from '../../../lib/Clients.mjs'
import { ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const accountConfirmationSchema = z.object({
  email: z.email(),
  confirmationCode: z.string().length(6)
});

const logger = new Logger({ serviceName: 'accountConfirmation' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { email, confirmationCode } = accountConfirmationSchema.parse(JSON.parse(event.body));

    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode
    });

    await clients.cognitoClient.send(command);
    
    return {
      statusCode: 204,
    };

  } catch (error) {
    const errorResponse = errorHandler(error);
    return errorResponse;
  }

}