import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('delete ST', () => {

  it('Should be able to delete an appointment type', async () => {

    const event = {
      queryStringParameters: {
        userId: '1234569',
      },
      body: JSON.stringify({
        appointmentTypeId: '0000001'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });

});