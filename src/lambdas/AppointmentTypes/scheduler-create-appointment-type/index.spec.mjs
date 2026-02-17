import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { mockClient } from 'aws-sdk-client-mock';
import { clients } from '../../../lib/Clients.mjs';

const ddbMock = mockClient(clients.dynamoClient);

describe('create AT', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should be able to create an appointmenttype', async () => {

    const event = {
      pathParameters: { userId: '1' },
      body: JSON.stringify({
        appointmentTypeName: 'Curso',
        appointmentTypePrice: "900"
    })};

    const { statusCode, body } = await handler(event);

    expect(statusCode).toBe(201);
    expect(body).toBeDefined();
    expect(JSON.parse(body).appointmentTypeId).toBeDefined();
  });

  it('Should return 400 when payload has missing props', async () => {

    const event = {
      pathParameters: { userId: '1' },
      body: JSON.stringify({
        appointmentTypeName: 'Curso'
    })};

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
  });

});