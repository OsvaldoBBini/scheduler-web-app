import { CodeMismatchException, InvalidPasswordException, UsernameExistsException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import z, { ZodError } from 'zod';

export class ErrorManager {

  constructor(logger) {
    this.logger = logger;
  }

  dispatchLoggerMessage = (e) => {
    this.logger.error(JSON.stringify({error: e.stack}));
  };


  errorHandler = (e) => {

    if(e instanceof ZodError) {
      this.dispatchLoggerMessage(e);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: z.treeifyError(e) })
      };
    }

    if (e instanceof UsernameExistsException) {
      this.dispatchLoggerMessage(e);
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'E-mail already in used' })
      };
    }

    if (e instanceof UserNotFoundException) {
      this.dispatchLoggerMessage(e);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }

    if (e instanceof CodeMismatchException) {
      this.dispatchLoggerMessage(e);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'The confirmation code is not valid' })
      };
    }

    if (e instanceof InvalidPasswordException) {
      this.dispatchLoggerMessage(e);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Invalid Password' })
      };
    }
      
    this.dispatchLoggerMessage(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' })
    };
  };

}