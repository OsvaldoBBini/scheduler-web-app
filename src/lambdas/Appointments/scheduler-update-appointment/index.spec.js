import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { mockClient } from "aws-sdk-client-mock";
import { clients } from '../../../lib/Clients.mjs';
import { PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddbMock = mockClient(clients.dynamoClient);

describe('update', () => {

  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(PutCommand).resolves({});
    ddbMock.on(DeleteCommand).resolves({});
  });

  it('Should be able to update an appointment (same date)', async () => {

    const event = {
      pathParameters: { userId: '4', appointmentDate: '23-05-2053' },
      body: JSON.stringify({
        appointmentId: '0000001',
        name: 'Osvaldo Bazzan',
        contact: '9999999999',
        startsAt: '09:00',
        endsAt: '10:00',
        appointmentType: 'Express',
        appointmentPayment: 50,
        newAppointmentDate: '23-05-2053'
      })
    };

    const { statusCode, body } = await handler(event);

    expect(statusCode).toBe(201);
    expect(body.appointmentId).toBeDefined();
    
    const calls = ddbMock.calls();
    expect(calls.length).toBe(1);
    expect(calls[0].args[0].constructor.name).toBe('PutCommand');
  });

  it('Should be able to update appointment date', async () => {

    const event = {
      pathParameters: { userId: '4', appointmentDate: '23-05-2053' },
      body: JSON.stringify({
        newAppointmentDate: '23-05-2054',
        appointmentId: '0000003',
        name: 'Osvaldo Bazzan',
        contact: '9999999999',
        startsAt: '05:00',
        endsAt: '06:00',
        appointmentType: 'Express',
        appointmentPayment: 50
      })
    };

    const { statusCode, body } = await handler(event);

    expect(statusCode).toBe(201);
    expect(body.appointmentId).toBeDefined();
    
    const calls = ddbMock.calls();
    expect(calls.length).toBe(2);
    expect(calls[0].args[0].constructor.name).toBe('PutCommand');
    expect(calls[1].args[0].constructor.name).toBe('DeleteCommand');
  });

  it('Should return 400 when appointmentPayment is negative', async () => {

    const event = {
      pathParameters: { userId: '4', appointmentDate: '23-05-2053' },
      body: JSON.stringify({
        newAppointmentDate: '23-05-2053',
        appointmentId: '0000001',
        name: 'Osvaldo Bazzan',
        contact: '9999999999',
        startsAt: '09:00',
        endsAt: '10:00',
        appointmentType: 'Express',
        appointmentPayment: -50
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const parsed = JSON.parse(response.body);
    expect(parsed.message).toBeDefined();
  });

  it('Should return 400 when appointmentDate has invalid format', async () => {

    const event = {
      pathParameters: { userId: '4', appointmentDate: '2053-05-23' },
      body: JSON.stringify({
        newAppointmentDate: '23-05-2053',
        appointmentId: '0000001',
        name: 'Osvaldo Bazzan',
        contact: '9999999999',
        startsAt: '09:00',
        endsAt: '10:00',
        appointmentType: 'Express',
        appointmentPayment: 50
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('Should return 400 when newAppointmentDate has invalid format', async () => {

    const event = {
      pathParameters: { userId: '4', appointmentDate: '23-05-2053' },
      body: JSON.stringify({
        newAppointmentDate: '2053-05-23',
        appointmentId: '0000001',
        name: 'Osvaldo Bazzan',
        contact: '9999999999',
        startsAt: '09:00',
        endsAt: '10:00',
        appointmentType: 'Express',
        appointmentPayment: 50
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('Should return 400 when missing required fields', async () => {

    const event = {
      pathParameters: { userId: '4', appointmentDate: '23-05-2053' },
      body: JSON.stringify({
        newAppointmentDate: '23-05-2053',
        appointmentId: '0000001',
        name: 'Osvaldo Bazzan',
        // missing contact, startsAt, endsAt
        appointmentType: 'Express',
        appointmentPayment: 50
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

  it('Should send PutCommand with correct Item fields', async () => {

    const event = {
      pathParameters: { userId: 'user123', appointmentDate: '15-02-2026' },
      body: JSON.stringify({
        newAppointmentDate: '15-02-2026',
        appointmentId: 'appo456',
        name: 'Alice',
        contact: '11111111',
        startsAt: '09:00',
        endsAt: '10:00',
        appointmentType: 'Consult',
        appointmentPayment: 100
      })
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(201);

    const calls = ddbMock.calls();
    const putCommand = calls[0].args[0];

    expect(putCommand.input.TableName).toBe('SAppointmentsTable');
    expect(putCommand.input.Item.PK).toBe('DATE#15-02-2026USER#user123');
    expect(putCommand.input.Item.SK).toBe('APPO#appo456');
    expect(putCommand.input.Item.GSI1SK).toBe('MONTH#02#YEAR#2026');
    expect(putCommand.input.Item.name).toBe('Alice');
    expect(putCommand.input.Item.contact).toBe('11111111');
    expect(putCommand.input.Item.appointmentPayment).toBe(100);
  });

  it('Should generate new SK when changing appointment date', async () => {

    const event = {
      pathParameters: { userId: 'user456', appointmentDate: '15-02-2025' },
      body: JSON.stringify({
        newAppointmentDate: '20-03-2025',
        appointmentId: 'oldAppo',
        name: 'Bob',
        contact: '22222222',
        startsAt: '14:00',
        endsAt: '15:00',
        appointmentType: 'Checkup',
        appointmentPayment: 80
      })
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(201);

    const calls = ddbMock.calls();
    const putCommand = calls[0].args[0];

    expect(putCommand.input.Item.SK).not.toBe('APPO#oldAppo');
    expect(putCommand.input.Item.SK).toMatch(/^APPO#[a-f0-9-]+$/);
    expect(putCommand.input.Item.GSI1SK).toBe('MONTH#03#YEAR#2025');
  });

  it('Should send DeleteCommand with correct key on date change', async () => {

    const event = {
      pathParameters: { userId: 'user789', appointmentDate: '10-01-2025' },
      body: JSON.stringify({
        newAppointmentDate: '15-01-2025',
        appointmentId: 'appoOld123',
        name: 'Charlie',
        contact: '33333333',
        startsAt: '10:00',
        endsAt: '11:00',
        appointmentType: 'Review',
        appointmentPayment: 75
      })
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(201);

    const calls = ddbMock.calls();
    const deleteCommand = calls[1].args[0];

    expect(deleteCommand.input.TableName).toBe('SAppointmentsTable');
    expect(deleteCommand.input.Key.PK).toBe('DATE#10-01-2025USER#user789');
    expect(deleteCommand.input.Key.SK).toBe('APPO#appoOld123');
  });

  it('Should return 400 when userId is missing in path parameters', async () => {

    const event = {
      pathParameters: { appointmentDate: '23-05-2053' },
      body: JSON.stringify({
        newAppointmentDate: '23-05-2053',
        appointmentId: '0000001',
        name: 'Osvaldo Bazzan',
        contact: '9999999999',
        startsAt: '09:00',
        endsAt: '10:00',
        appointmentType: 'Express',
        appointmentPayment: 50
      })
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
  });

});