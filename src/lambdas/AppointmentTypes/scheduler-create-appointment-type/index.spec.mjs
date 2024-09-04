import { expect, it, describe } from 'vitest'
import { handler } from './index.mjs';

describe('create AT', () => {

  it('Should be able to create an appointmenttype', async () => {

    const event = {
      pathParameters: { userId: '1' },
      body: JSON.stringify({
        appointmentTypeName: 'Curso',
        appointmentTypePrice: 900
    })};

    const { statusCode } = await handler(event);

    expect(statusCode).toBe(204);
  });

  it('Should not be able to create an appointment type with missing props', async () => {

    const event = {
      pathParameters: { userId: '1' },
      body: JSON.stringify({
        appointmentTypeName: 'Curso'
    })};

    const { body } = await handler(event);
    const { error } = JSON.parse(body)

    expect(error).toBe('Some fields are missing');
  });

});