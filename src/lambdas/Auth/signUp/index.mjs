import { clients } from "../../lib/Clients.mjs";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event) {

  try {
    const body = JSON.parse(event.body);

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [{
        Name: 'given_name',
        Value: body.firstName
      }]
    });

    const { UserSub } = await clients.cognitoClient.send(command);
    
    return {
      statusCode: 201,
      body: JSON.stringify({user: {id: UserSub}}),
    };
  } catch { /* empty */ };

}