import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('update ST', () => {

  it('Should be able to update an appointment type', async () => {

    const event = {
      queryStringParameters: { userId: '1234567', appointmentTypeId: '0000001'},
      body: JSON.stringify({
        appointmentTypeName: 'Social',
        appointmentTypePrice: 130
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

});