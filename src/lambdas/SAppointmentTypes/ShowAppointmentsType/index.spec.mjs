import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('show AT', () => {

  it('Should be able to show appointment types', async () => {

    const event = {
      queryStringParameters: {
        userEmail: 'johnthree@gmail.com',
      }
    };

    const { body } = await handler(event);
    const appointmentTypes = JSON.parse(body);

    expect(appointmentTypes.Count).toBe(1);
  });

});