import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('create AT', () => {

  it('Should be able to create an appointmenttype', async () => {

    const event = {
      queryStringParameters: { userId: '123456' },
      body: JSON.stringify({
        appointmentTypeName: 'Curso',
        appointmentTypePrice: 900
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

  it('Should not be able to create an appointment type with missing props', async () => {

    const event = {
      queryStringParameters: { userId: '123456' },
      body: JSON.stringify({
        appointmentTypeName: 'Curso'
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(404);
  });

});