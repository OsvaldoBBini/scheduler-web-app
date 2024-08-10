import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('update', () => {

  it('Should be able to update an appointment', async () => {

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
      startsAt: 60,
      endsAt: 120,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(409);
  });

});