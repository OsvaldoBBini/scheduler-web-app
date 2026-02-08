import {expect, it, describe, beforeEach} from 'vitest'
import { handler } from './index.mjs';
import {mockClient} from "aws-sdk-client-mock";
import {clients} from "../../../lib/Clients.mjs";
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(clients.dynamoClient);

describe('show', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should be able to show appointments', async () => {

    const dbMock = {
      PK: 'DATE#01-01-2026#USER#user-id',
      SK: 'APPO#random-id',
      GSI1PK: 'APPOINTMENT',
      GSI1SK: '01-01-2026',
      name: 'test-user',
      contact: '55999999999',
      startsAt: '14:00',
      endsAt: '15:00',
      appointmentType: 'Curso',
      appointmentPayment: 50
    };

    ddbMock.on(QueryCommand).resolves({Items: [dbMock], Count: 1})

    const event = {
      pathParameters: {
        userId: 'user-id',
        appointmentDate: '01-01-2026'
      }
    };

    const { body } = await handler(event);
    const appointments = JSON.parse(body);

    expect(appointments[0].userId).toBe('user-id');
    expect(appointments[0].appointmentDate).toBe('01-01-2026');
    expect(appointments[0].name).toBe('test-user');
  });

});