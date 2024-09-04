import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('show', () => {

  it('Should be able to show appointments', async () => {

    const event = {
      pathParameters: {
        userId: '3',
      },
      queryStringParameters: {
        appointmentDate: '23/05/2050'
      }
    };

    const { body } = await handler(event);
    const appointments = JSON.parse(body);

    expect(appointments.Count).toBe(1);
  });

});