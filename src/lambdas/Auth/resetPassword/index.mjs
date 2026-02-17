import { clients } from '../../../lib/Clients.mjs'
import { ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const resetPasswordSchema = z.object({
  email: z.email(),
  code: z.string().length(6),
  newPassword: z.string().min(8)
});

const logger = new Logger({ serviceName: 'resetPassword' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { email, code, newPassword } = resetPasswordSchema.parse(JSON.parse(event.body));

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    });

    await clients.cognitoClient.send(command);
    
    return {
      statusCode: 204,
      body: null,
    };

  } catch (error) {
    const errorResponse = errorHandler(error);
    return errorResponse;
  }
}