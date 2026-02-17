import { expect, it, describe, beforeEach, vi } from 'vitest'
import { handler } from './index.mjs';
import { mockClient } from "aws-sdk-client-mock";
import { clients } from '../../../lib/Clients.mjs';
import { PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddbMock = mockClient(clients.dynamoClient);

const event = {
    pathParameters: {
      userId: 'user123',
      appointmentDate: '15-08-2024'
    },
    body: JSON.stringify({
      newAppointmentDate: '16-08-2024',
      appointmentId: 'uuid123',
      name: 'John Doe',
      contact: 'john.doe@example.com',
      startsAt: '09:00',
      endsAt: '10:00',
      appointmentType: 'Consultation',
      appointmentPayment: "150"
    })
  };

describe('update', () => {

  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(PutCommand).resolves({});
    ddbMock.on(DeleteCommand).resolves({});
  });

  it('should update an appointment successfully', async () => {

    vi.mock('node:crypto', () => ({
      randomUUID: () => 'uuid123'
    }));

    const response = await handler(event);

    expect(response.statusCode).toBe(201);
    expect(response.body.appointmentId).toBe('APPO#uuid123');
  });
  
  it('should throw an error when a path parameter is missing', async () => {

    vi.mock('node:crypto', () => ({
      randomUUID: () => 'uuid123'
    }));

    const response = await handler({
      ...event,
      pathParameters: {
        ...event.pathParameters,
        userId: undefined
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual('{"message":{"errors":[],"properties":{"userId":{"errors":["Invalid input: expected string, received undefined"]}}}}');
  });
  
  it('should throw an error when a body property is missing', async () => {

    vi.mock('node:crypto', () => ({
      randomUUID: () => 'uuid123'
    }));

    const response = await handler({
      ...event,
      body: JSON.stringify({
        ...JSON.parse(event.body),
        name: undefined
      })
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual('{"message":{"errors":[],"properties":{"name":{"errors":["Invalid input: expected string, received undefined"]}}}}');
  });

});