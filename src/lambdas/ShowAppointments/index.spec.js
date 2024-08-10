import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('show', () => {

  it('Should be able to show 1 appointment', async () => {

    const event = {
      queryStringParameters: {
        userId: '1234567',
        appointmentDate: '23/05/2050'
      }
    };

    const { body } = await handler(event);
    const appointments = JSON.parse(body);

    expect(appointments.Count).toBe(1);
  });

});