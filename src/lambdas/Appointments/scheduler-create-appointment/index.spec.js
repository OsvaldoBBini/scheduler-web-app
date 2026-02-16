import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { generateRandomNumber } from '../../../../tests/utils/generateRandomNumber.mjs';
import { mockClient } from "aws-sdk-client-mock";
import { clients } from '../../../lib/Clients.mjs';

const ddbMock = mockClient(clients.dynamoClient);

describe('create', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should be able to create an appointment', async () => {

    const randomDay = generateRandomNumber(1,12);
    const randomMonth = generateRandomNumber(1,31);
    const randomYear = generateRandomNumber(2024, 2040);

    const event = {
      body: JSON.stringify({
      userId: '1',
      appointmentDate: `${randomDay}-${randomMonth}-${randomYear}`,
      name: 'Osvaldo Bazzan',
      contact: '9999999999', 
      startsAt: '14:00',
      endsAt: '15:00',
      appointmentType: 'Curso',
      appointmentPayment: 50
    })};

    const { statusCode, body } = await handler(event);

    expect(statusCode).toBe(201);
    expect(body.appointmentId).toBeDefined();
  });

  it('Should return 400 when payload is invalid', async () => {

    const event = {
      body: JSON.stringify({
        appointmentDate: `1-1-2025`,
        name: 'Invalid',
        contact: '000',
        startsAt: '10:00',
        endsAt: '11:00',
        appointmentType: 'Test',
        appointmentPayment: -5
      })
    };

    const response = await handler(event);
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual('{"message":{"errors":[],"properties":{"userId":{"errors":["Invalid input: expected string, received undefined"]},"appointmentPayment":{"errors":["Too small: expected number to be >0"]}}}}');
  });

});