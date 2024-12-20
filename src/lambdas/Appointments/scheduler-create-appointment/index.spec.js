import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';
import { generateRandomNumber } from '../../../../tests/utils/generateRandomNumber.mjs';


describe('create', () => {

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

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

  // it('Should not to be able to create a conflicted appointment', async () => {

  //   const event = {
  //     body: JSON.stringify({
  //     userId: '1',
  //     appointmentDate: '23-05-2050',
  //     name: 'John Doe',
  //     contact: '9999999999', 
  //     startsAt: 60,
  //     endsAt: 120,
  //     appointmentType: 'Express',
  //     appointmentPayment: 50
  //   })};

  //   const { body } = await handler(event);
  //   const { error } = JSON.parse(body);

  //   expect(error).toStrictEqual('An appointment already exists for this date.');
  // });

});