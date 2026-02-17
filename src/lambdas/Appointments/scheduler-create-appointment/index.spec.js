import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { mockClient } from "aws-sdk-client-mock";
import { clients } from '../../../lib/Clients.mjs';

const ddbMock = mockClient(clients.dynamoClient);

describe('create', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should be able to create an appointment', async () => {

    const event = {
      body: JSON.stringify({
      userId: '1',
      appointmentDate: '01-01-2025',
      name: 'Osvaldo Bazzan',
      contact: '9999999999', 
      startsAt: '14:00',
      endsAt: '15:00',
      appointmentType: 'Curso',
      appointmentPayment: "50"
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
        appointmentPayment: "-5"
      })
    };

    const response = await handler(event);
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('{"message":{"errors":[],"properties":{"userId":{"errors":["Invalid input: expected string, received undefined"]},"appointmentDate":{"errors":["Invalid string: must match pattern /^\\\\d{2}-\\\\d{2}-\\\\d{4}$/"]}}}}');
  });

});