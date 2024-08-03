import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import { handler, clients } from './index.mjs';
import { createLocalDynamoClient, deleteTableCommand, createTableCommand, initialData } from '../../utils/createLocalDynamoClient.mjs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

describe('delete', () => {

  beforeEach(async () => {
    clients.dynamoClient = createLocalDynamoClient();
    await clients.dynamoClient.send(createTableCommand);
    
    initialData.map(async (item) => {
      await clients.dynamoClient.send(new PutItemCommand(item));
    })
  });
  
  afterEach(async () => {
    await clients.dynamoClient.send(deleteTableCommand);
  });

  it('Should be able to delete an appointment', async () => {

    const event = {
      queryStringParameters: {
        userId: '1234567',
      },
      body: JSON.stringify({
        appointmentId: '0000001'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });

});