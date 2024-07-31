import { beforeAll, expect, it, describe } from 'vitest'
import { handler, clients } from './index.mjs';
import { createLocalDynamoClient, deleteTableCommand, createTableCommand } from '../../utils/createLocalDynamoClient.mjs';

describe('Create Appointment', () => {

  beforeAll(() => {
    clients.dynamoClient.send(deleteTableCommand);
    clients.dynamoClient = createLocalDynamoClient();
    clients.dynamoClient.send(createTableCommand);
  });

  it('Should be able to create an appointment', async () => {

    const event = JSON.stringify({
      body: {
      userId: '1234567',
      appointmentDate: '24/05/2001',
      name: 'Osvaldo Bazzan',
      phoneNumber: '55984632951', 
      startsAt: 660,
      endsAt: 690,
      appointmentType: 'Curso',
      confirmed: false
    }});

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

});