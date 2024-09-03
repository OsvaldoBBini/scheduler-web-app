import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('update', () => {

  it('Should be able to update an appointment', async () => {

    const event = {
      queryStringParameters: { userEmail: 'johnfour@gmail.com', appointmentId: 'APPO#0000001'},
      body: JSON.stringify({
      appointmentDate: '23/05/2050',
      name: 'Osvaldo Bazzan',
      phoneNumber: '9999999999', 
      startsAt: 240,
      endsAt: 300,
      appointmentType: 'Express',
      confirmed: true,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

  it('Should not be able to update an appointment', async () => {

    const event = {
      queryStringParameters: { userEmail: 'johnfour@gmail.com', appointmentId: 'APPO#0000003'},
      body: JSON.stringify({
      appointmentDate: '23/05/2050',
      name: 'Osvaldo Bazzan',
      phoneNumber: '9999999999', 
      startsAt: 120,
      endsAt: 180,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment: 50
    })};

    const { body } = await handler(event);
    const { error } = JSON.parse(body)

    expect(error).toBe('An appointment already exists for this date.');
  });

});