import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { mockClient } from "aws-sdk-client-mock";
import { clients } from '../../../lib/Clients.mjs';
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddbMock = mockClient(clients.dynamoClient);

describe('delete appointment', () => {

  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(DeleteCommand).resolves({});
  });

  it('Should be able to delete an appointment', async () => {

    const event = {
      body: JSON.stringify({
        userId: '2',
        appointmentId: '0000001',
        appointmentDate: '23-05-2051'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(204);
    expect(response.body).toBeNull();
  });

  it('Should return 400 when payload is invalid', async () => {

    const event = {
      body: JSON.stringify({
        userId: '2',
        appointmentId: '0000001',
        // missing appointmentDate
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const parsed = JSON.parse(response.body);
    expect(parsed.message).toBeDefined();
  });

  it('Should send DeleteCommand with correct parameters', async () => {

    const event = {
      body: JSON.stringify({
        userId: 'user123',
        appointmentId: 'appo456',
        appointmentDate: '15-02-2026'
      })
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(204);

    const calls = ddbMock.calls();
    expect(calls.length).toBeGreaterThan(0);
    const deleteCommand = calls[0].args[0];
    
    expect(deleteCommand.input.TableName).toBe('SAppointmentsTable');
    expect(deleteCommand.input.Key.PK).toBe('DATE#15-02-2026USER#user123');
    expect(deleteCommand.input.Key.SK).toBe('APPO#appo456');
  });

  it('Should handle missing userId field', async () => {

    const event = {
      body: JSON.stringify({
        appointmentId: '0000001',
        appointmentDate: '23-05-2051'
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

});