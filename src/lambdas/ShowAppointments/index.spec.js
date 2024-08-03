import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import { handler, clients } from './index.mjs';
import { createLocalDynamoClient, deleteTableCommand, createTableCommand, initialData } from '../../utils/createLocalDynamoClient.mjs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

describe('show', () => {

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

  it('Should be able to show appointments', async () => {

    const event = {
      queryStringParameters: {
        userId: '123456',
        appointmentDate: '23/05/2050'
      }
    };

    const { body } = await handler(event);
    const appointments = JSON.parse(body);

    expect(appointments.Count).toBe(2);
  });

});