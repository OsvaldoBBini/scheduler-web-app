import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('update', () => {

  it('Should be able to update an appointment', async () => {

    const event = {
      pathParameters: {  userId: '4', appointmentDate: '23-05-2053'},
      body: JSON.stringify({
      appointmentId: '0000001',
      name: 'Osvaldo Bazzan',
      phoneNumber: '9999999999', 
      startsAt: '09:00',
      endsAt: '10:00',
      appointmentType: 'Express',
      confirmed: true,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

  // it('Should not be able to update an appointment', async () => {

  //   const event = {
  //     pathParameters: {userId: '4', appointmentDate: '23-05-2053'},
  //     body: JSON.stringify({
  //     appointmentId: '0000003',
  //     name: 'Osvaldo Bazzan',
  //     phoneNumber: '9999999999', 
  //     startsAt: 120,
  //     endsAt: 180,
  //     appointmentType: 'Express',
  //     confirmed: false,
  //     appointmentPayment: 50
  //   })};

  //   const { body } = await handler(event);
  //   const { error } = JSON.parse(body)

  //   expect(error).toBe('An appointment already exists for this date.');
  // });

  it('Should be able to update appointment date', async () => {

    const event = {
      pathParameters: { userId: '4', appointmentDate: '23-05-2053'},
      body: JSON.stringify({
      newAppointmentDate: '23-05-2054',
      appointmentId: '0000003',
      name: 'Osvaldo Bazzan',
      phoneNumber: '9999999999', 
      startsAt: '05:00',
      endsAt: '06:00',
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

});