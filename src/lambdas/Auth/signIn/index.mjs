import { clients } from '../../../lib/Clients.mjs'
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const signInSchema = z.object({
  email: z.email(),
  password: z.string()
});

const logger = new Logger({ serviceName: 'signIn' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { email, password } = signInSchema.parse(JSON.parse(event.body));

    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
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
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken
      })
    };

  } catch (error) {
    const errorResponse = errorHandler(error);
    return errorResponse;
  }

}