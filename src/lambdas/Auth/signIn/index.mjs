import { clients } from '../../../lib/Clients.mjs'
import { InitiateAuthCommand, UserNotConfirmedException, UserNotFoundException } from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event) {

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: 'Some fields were not filled in correctly'})
      }
    }

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
        body: JSON.parse({error: 'Invalid Credentials.'})
      }
    }
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken
      }),
    };

  } catch (error) {
    if (error instanceof UserNotFoundException) {
      return {
        statusCode: 401,
        body: JSON.stringify({error: 'Usuário não encontrado'})
      }
    }

    if (error instanceof UserNotConfirmedException) {
      return {
        statusCode: 401,
        body: JSON.stringify({error: 'Usuário não possui a conta validada'})
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal Server Error'})
    }
  };

}