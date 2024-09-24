import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { clients } from '../../../lib/Clients.mjs'

export async function handler(event) {
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const command = new AdminGetUserCommand({
    Username: userId,
    UserPoolId: process.env.COGNITO_POOL_ID
  })

  const { UserAttributes } = await clients.cognitoClient.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify(UserAttributes),
  }
}