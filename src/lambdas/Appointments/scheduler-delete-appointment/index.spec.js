import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('delete', () => {

  it('Should be able to delete an appointment', async () => {

    const event = {
      queryStringParameters: {
        userEmail: 'johntwo@gmail.com',
      },
      body: JSON.stringify({
        appointmentId: 'APPO#0000001'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });

});