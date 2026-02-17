import { clients } from '../../../lib/Clients.mjs'
import { ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const forgotPasswordSchema = z.object({
  email: z.email()
});

const logger = new Logger({ serviceName: 'forgotPassword' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { email } = forgotPasswordSchema.parse(JSON.parse(event.body));

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
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