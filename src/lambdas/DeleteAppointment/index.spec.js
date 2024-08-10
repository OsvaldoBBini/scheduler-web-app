import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('delete', () => {

  it('Should be able to delete an appointment', async () => {

    const event = {
      queryStringParameters: {
        userId: '12345678',
      },
      body: JSON.stringify({
        appointmentId: '0000003'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });

});