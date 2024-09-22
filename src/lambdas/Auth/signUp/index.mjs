import clients from '../../../lib/Clients.mjs'
import { SignUpCommand, UsernameExistsException } from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event) {

  try {
    const { email, password, firstName } = JSON.parse(event.body);

    if (!email || !password || !firstName) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: 'Some fields were not filled in correctly'})
      }
    }

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
    if (error instanceof UsernameExistsException) {
      return {
        statusCode: 409,
        body: JSON.stringify({'error': 'Esse email já está sendo usado'})
      }
    }
  };

}