import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { mockClient } from 'aws-sdk-client-mock';
import { clients } from '../../../lib/Clients.mjs';

const ddbMock = mockClient(clients.dynamoClient);

describe('delete AT', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should be able to delete an appointment type', async () => {

    const event = {
      pathParameters: {
        userId: '2',
      },
      body: JSON.stringify({
        appointmentTypeId: '0000001'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
  });

  it('Should return 400 when appointmentTypeId is missing', async () => {

    const event = {
      pathParameters: {
        userId: '2',
      },
      body: JSON.stringify({})
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
  });

});