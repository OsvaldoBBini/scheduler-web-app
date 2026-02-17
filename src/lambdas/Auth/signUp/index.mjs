import { clients } from '../../../lib/Clients.mjs'
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';
import z from 'zod';

const signUpSchema = z.object({
  email: z.email(),
  password: z.string(),
  firstName: z.string()
});

const logger = new Logger({ serviceName: 'signUp' });
const { errorHandler } = new ErrorManager(logger);

export async function handler(event) {

  try {
    const { email, password, firstName } = signUpSchema.parse(JSON.parse(event.body));

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [{
        Name: 'given_name',
        Value: firstName
      }]
    });

    const { UserSub } = await clients.cognitoClient.send(command);
    
    return {
      statusCode: 201,
      body: JSON.stringify({user: {id: UserSub}}),
    };

  } catch (error) {
    const errorResponse = errorHandler(error);
    return errorResponse;
  }

}