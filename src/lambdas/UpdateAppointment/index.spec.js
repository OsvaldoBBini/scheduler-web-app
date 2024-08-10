import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import { handler } from './index.mjs';
import { clients } from '../lib/Cients.mjs';
import { createLocalDynamoClient, deleteTableCommand, createTableCommand } from '../../utils/createLocalDynamoClient.mjs';
import { initialData } from '../../utils/createLocalDynamoClient.mjs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

describe('update', () => {

  beforeEach(async () => {
    clients.dynamoClient = createLocalDynamoClient();
    await clients.dynamoClient.send(createTableCommand);

    await Promise.all(initialData.map((item) => {
      clients.dynamoClient.send(new PutItemCommand(item));
    }));
  });
  
  afterEach(async () => {
    await clients.dynamoClient.send(deleteTableCommand);
  })

  it('Should not be able to update an appointment', async () => {

    const event = {
      queryStringParameters: { userId: '1234567' },
      body: JSON.stringify({
      appointmentId: '0000001',
      appointmentDate: '23/05/2050',
      name: 'Osvaldo Bazzan',
      phoneNumber: '9999999999', 
      startsAt: 660,
      endsAt: 690,
      appointmentType: 'Express',
      confirmed: true,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

  it('Should not be able to update an appointment', async () => {

    const event = {
      queryStringParameters: { userId: '123456' },
      body: JSON.stringify({
      appointmentId: '0000002',
      appointmentDate: '23/05/2050',
      name: 'Osvaldo Bazzan',
      phoneNumber: '9999999999', 
      startsAt: 120,
      endsAt: 180,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(409);
  });

});