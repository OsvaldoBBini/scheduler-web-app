import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import { handler } from './index.mjs';
import { createLocalDynamoClient, deleteTableCommand, createTableCommand, initialData } from '../../utils/createLocalDynamoClient.mjs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { clients } from '../lib/Cients.mjs';

describe('show', () => {

  beforeEach(async () => {
    clients.dynamoClient = createLocalDynamoClient();
    await clients.dynamoClient.send(createTableCommand);

    await Promise.all(initialData.map((item) => {
      clients.dynamoClient.send(new PutItemCommand(item));
    }));
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

  it('Should be able to show appointments', async () => {

    const event = {
      queryStringParameters: {
        userId: '1234567',
        appointmentDate: '23/05/2050'
      }
    };

    const { body } = await handler(event);
    const appointments = JSON.parse(body);

    expect(appointments.Count).toBe(1);
  });

});