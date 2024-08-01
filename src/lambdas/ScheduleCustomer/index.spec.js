import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import { handler, clients } from './index.mjs';
import { createLocalDynamoClient, deleteTableCommand, createTableCommand } from '../../utils/createLocalDynamoClient.mjs';

describe('Create Appointment', () => {

  beforeEach(async () => {
    clients.dynamoClient = createLocalDynamoClient();
    await clients.dynamoClient.send(createTableCommand);
  });
  
  afterEach(async () => {
    await clients.dynamoClient.send(deleteTableCommand);
  })

  it('Should be able to create an appointment', async () => {

    const event = JSON.stringify({
      body: {
      userId: '123456',
      appointmentDate: '24/05/2001',
      name: 'Osvaldo Bazzan',
      phoneNumber: '55984632951', 
      startsAt: 660,
      endsAt: 690,
      appointmentType: 'Curso',
      confirmed: false,
      appointmentPayment: 50
    }});

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

  it('Should be able to create an appointment with missing props', async () => {

    const event = JSON.stringify({
      body: {
      userId: '123456',
      appointmentDate: '24/05/2001',
      name: 'Osvaldo Bazzan',
      phoneNumber: '55984632951',
      appointmentType: 'Curso',
      confirmed: false,
      appointmentPayment: 50
    }});

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(404);
  });

  it('Should not to be able to create a conflicted appointment', async () => {

    const event1 = JSON.stringify({
      body: {
      userId: '123456',
      appointmentDate: '24/05/2001',
      name: 'John Doe',
      phoneNumber: '55984632951', 
      startsAt: 660,
      endsAt: 690,
      appointmentType: 'Curso',
      confirmed: false,
      appointmentPayment: 50
    }});
    
    await handler(event1);
    
    const event2 = JSON.stringify({
      body: {
      userId: '123456',
      appointmentDate: '24/05/2001',
      name: 'John Doe',
      phoneNumber: '55984632951', 
      startsAt: 670,
      endsAt: 680,
      appointmentType: 'Curso',
      confirmed: false,
      appointmentPayment: 50
    }});

    const event3 = JSON.stringify({
      body: {
      userId: '123456',
      appointmentDate: '24/05/2001',
      name: 'John Doe',
      phoneNumber: '55984632951', 
      startsAt: 640,
      endsAt: 680,
      appointmentType: 'Curso',
      confirmed: false,
      appointmentPayment: 50
    }});

    const { statusCode: statusCode2 } = await handler(event2);
    const { statusCode: statusCode3 } = await handler(event3);

    expect([statusCode2, statusCode3]).toStrictEqual([409, 409]);
  });

});