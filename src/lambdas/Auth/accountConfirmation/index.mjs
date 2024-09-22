import clients from '../../../lib/Clients.mjs'
import { CodeMismatchException, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event) {

  try {
    const { email, confirmationCode } = JSON.parse(event.body);

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

    if (error instanceof CodeMismatchException) {
      return {
        statusCode: 409,
        body: JSON.stringify({'error': 'O código enviado não é válido'})
      }
    }
  
  };

}