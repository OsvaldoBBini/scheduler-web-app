import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { clients } from '../../../lib/Clients.mjs'
import { Logger } from '@aws-lambda-powertools/logger';
import { ErrorManager } from '../../../errors/errorManager.mjs';

const logger = new Logger({ serviceName: 'getProfile' });
const { errorHandler } = new ErrorManager(logger);

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

  } catch (error) {
    const errorResponse = errorHandler(error);
    return errorResponse;
  }
}