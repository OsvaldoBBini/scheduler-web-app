import {expect, it, describe, beforeEach} from 'vitest'
import { handler } from './index.mjs';
import {mockClient} from "aws-sdk-client-mock";
import {clients} from "../../../lib/Clients.mjs";
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { defaultAppointment } from '../../../../tests/utils/defaultAppointment.mjs';

const ddbMock = mockClient(clients.dynamoClient);

describe('show', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should be able to show appointments', async () => {

    const dbMock = defaultAppointment();

    ddbMock.on(QueryCommand).resolves({Items: [dbMock], Count: 1})

    const event = {
      pathParameters: {
        userId: 'user-id',
        month: '01',
        year: '2026'
      }
    };

    const { body } = await handler(event);
    const appointments = JSON.parse(body);

    expect(appointments[0].userId).toBe('user-id');
    expect(appointments[0].appointmentDate).toBe('01-01-2026');
    expect(appointments[0].name).toBe('test-user');
  });

  it('Should throw an error if year is missing', async () => {

    const dbMock = defaultAppointment();

    ddbMock.on(QueryCommand).resolves({Items: [dbMock], Count: 1})

    const event = {
      pathParameters: {
        userId: 'user-id',
        month: '01',
      }
    };

    const { body } = await handler(event);
    expect(body).toStrictEqual('{"message":{"errors":[],"properties":{"year":{"errors":["Invalid input: expected string, received undefined"]}}}}');
  });

});