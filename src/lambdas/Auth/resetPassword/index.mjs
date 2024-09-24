import { clients } from '../../../lib/Clients.mjs'
import { ConfirmForgotPasswordCommand, UserNotFoundException, InvalidPasswordException,CodeMismatchException } from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event) {

  try {
    const { email, code, newPassword } = JSON.parse(event.body);

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
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

    if (error instanceof InvalidPasswordException) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: 'Senha Inválida'})
      }
    }
    
    if (error instanceof CodeMismatchException) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: 'Credenciais inválidas'})
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal Server Error'})
    }
  
  };

}