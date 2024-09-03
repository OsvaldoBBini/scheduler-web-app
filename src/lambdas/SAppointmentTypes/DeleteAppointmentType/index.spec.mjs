import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('delete ST', () => {

  it('Should be able to delete an appointment type', async () => {

    const event = {
      queryStringParameters: {
        userId: 'johntwo@gmail.com',
      },
      body: JSON.stringify({
        appointmentTypeId: 'TYPE#0000001'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });

});