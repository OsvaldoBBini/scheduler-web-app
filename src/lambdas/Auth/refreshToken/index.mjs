import { clients } from '../../../lib/Clients.mjs'
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

const logger = new Logger({ serviceName: 'refreshToken' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { refreshToken } = refreshTokenSchema.parse(JSON.parse(event.body));

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    });

    const { AuthenticationResult } = await clients.cognitoClient.send(command);

    if (!AuthenticationResult) {
      return {
        statusCode: 401,
        body: JSON.stringify({error: 'Invalid Credentials.'})
      }
    }
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        accessToken: AuthenticationResult.AccessToken
      }),
    };

  } catch (error) {
    const errorResponse = errorHandler(error);
    return errorResponse;
  }

}