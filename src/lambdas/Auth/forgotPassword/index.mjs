import { clients } from '../../../lib/Clients.mjs'
import { ForgotPasswordCommand, UserNotFoundException } from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event) {

  try {
    const { email } = JSON.parse(event.body);

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    });

    await clients.cognitoClient.send(command);
    
    return {
      statusCode: 204,
    };

  } catch (error) {

    if (error instanceof UserNotFoundException) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: 'Usuário não encontrado'})
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal Server Error'})
    }
  
  };

}