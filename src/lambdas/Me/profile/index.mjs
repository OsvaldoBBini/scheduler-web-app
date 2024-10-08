import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { clients } from '../../../lib/Clients.mjs'

export async function handler(event) {

  try {

    const userId = event.requestContext.authorizer.jwt.claims.sub;
  
    const command = new AdminGetUserCommand({
      Username: userId,
      UserPoolId: process.env.COGNITO_POOL_ID
    })
  
    const { UserAttributes } = await clients.cognitoClient.send(command);

    const attributes = UserAttributes.reduce((acc, post) => {
      let { Name, Value } = post;
      return {...acc, [Name]: Value};
    }, {});
  
    return {
      statusCode: 201,
      body: JSON.stringify(attributes),
    }

  } catch {
    
    return {
      statusCode: 500,
      body: JSON.stringify({'error': 'Internal server error'}),
    }
  }
}