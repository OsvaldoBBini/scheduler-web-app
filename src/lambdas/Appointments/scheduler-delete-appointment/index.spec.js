import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('delete', () => {

  it('Should be able to delete an appointment', async () => {

    const event = {
      body: JSON.stringify({
        userId: '2',
        appointmentId: 'APPO#0000001',
        appointmentDate: '23-05-2051'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });

});