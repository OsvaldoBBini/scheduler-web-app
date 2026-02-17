import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { mockClient } from 'aws-sdk-client-mock';
import { clients } from '../../../lib/Clients.mjs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(clients.dynamoClient);

describe('show AT', () => {

  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should be able to show appointment types', async () => {

    const mockAppointmentType = {
      PK: 'USER#3',
      SK: 'TYPE#type-id-123',
      appointmentTypeName: 'Curso',
      appointmentTypePrice: 900
    };

    ddbMock.on(QueryCommand).resolves({ Items: [mockAppointmentType], Count: 1 });

    const event = {
      pathParameters: {
        userId: '3',
      }
    };

    const { body, statusCode } = await handler(event);
    const appointmentTypes = JSON.parse(body);

    expect(statusCode).toBe(200);
    expect(appointmentTypes).toBeDefined();
    expect(appointmentTypes).toHaveLength(1);
    expect(appointmentTypes[0].appointmentTypeId).toBe('type-id-123');
    expect(appointmentTypes[0].appointmentTypeName).toBe('Curso');
    expect(appointmentTypes[0].appointmentTypePrice).toBe(900);
  });

  it('Should return empty array when no appointment types found', async () => {

    ddbMock.on(QueryCommand).resolves({ Items: [], Count: 0 });

    const event = {
      pathParameters: {
        userId: '4',
      }
    };

    const { body, statusCode } = await handler(event);
    const appointmentTypes = JSON.parse(body);

    expect(statusCode).toBe(200);
    expect(appointmentTypes).toEqual([]);
  });

});