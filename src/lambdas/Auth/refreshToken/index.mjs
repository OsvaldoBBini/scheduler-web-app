import { clients } from '../../../lib/Clients.mjs'
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event) {

  try {
    const { refreshToken } = JSON.parse(event.body);

    if (!refreshToken) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: 'Some fields were not filled in correctly'})
      }
    }

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
        body: JSON.parse({error: 'Invalid Credentials.'})
      }
    }
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        accessToken: AuthenticationResult.AccessToken
      }),
    };

  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal Server Error'})
    }
  };

}