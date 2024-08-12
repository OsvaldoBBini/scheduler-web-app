import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';
import { generateRandomNumber } from '../../../tests/utils/generateRandomNumber.mjs';


describe('create', () => {

  it('Should be able to create an appointment', async () => {

    const randomDay = generateRandomNumber(1,12);
    const randomMonth = generateRandomNumber(1,31);
    const randomYear = generateRandomNumber(2024, 2040);

    const event = {
      body: JSON.stringify({
      userId: '123456',
      appointmentDate: `${randomDay}/${randomMonth}/${randomYear}`,
      name: 'Osvaldo Bazzan',
      phoneNumber: '9999999999', 
      startsAt: 480,
      endsAt: 540,
      appointmentType: 'Curso',
      confirmed: false,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

  it('Should not be able to create an appointment with missing props', async () => {

    const event = {
      body: JSON.stringify({
      userId: '123456',
      appointmentDate: '24/05/2001',
      name: 'Osvaldo Bazzan',
      phoneNumber: '9999999999',
      appointmentType: 'Curso',
      confirmed: false,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(404);
  });

  it('Should not to be able to create a conflicted appointment', async () => {

    const event = {
      body: JSON.stringify({
      userId: '123456',
      appointmentDate: '23/05/2050',
      name: 'John Doe',
      phoneNumber: '9999999999', 
      startsAt: 60,
      endsAt: 120,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment: 50
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(409);
  });

});