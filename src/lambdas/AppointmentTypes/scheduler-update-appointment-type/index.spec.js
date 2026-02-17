import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { mockClient } from 'aws-sdk-client-mock';
import { clients } from '../../../lib/Clients.mjs';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(clients.dynamoClient);

describe('update AT', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should be able to update an appointment type', async () => {

    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        PK: 'USER#1',
        SK: 'TYPE#0000001',
        appointmentTypeName: 'Social',
        appointmentTypePrice: "130"
      }
    });

    const event = {
      pathParameters: { userId: '1' },
      queryStringParameters: { appointmentTypeId: '0000001'},
      body: JSON.stringify({
        appointmentTypeName: 'Social',
        appointmentTypePrice: "130"
    })};

    const { statusCode, body } = await handler(event);

    expect(statusCode).toBe(204);
    expect(body).toBeNull();
  });

  it('Should return 400 when payload has missing props', async () => {

    ddbMock.on(UpdateCommand).resolves({});

    const event = {
      pathParameters: { userId: '1' },
      queryStringParameters: { appointmentTypeId: '0000001'},
      body: JSON.stringify({
        appointmentTypeName: 'Social'
    })};

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeDefined();
  });

});