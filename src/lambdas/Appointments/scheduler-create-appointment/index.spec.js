import { expect, it, describe, beforeEach } from 'vitest'
import { handler } from './index.mjs';
import { generateRandomNumber } from '../../../../tests/utils/generateRandomNumber.mjs';
import { mockClient } from "aws-sdk-client-mock";
import { clients } from '../../../lib/Clients.mjs';
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const ddbMock = mockClient(clients.dynamoClient);

describe('create', () => {

  beforeEach(() => {
    ddbMock.reset();
    ddbMock.on(PutCommand).resolves({});
  });

  it('Should be able to create an appointment', async () => {

    const randomDay = generateRandomNumber(1,12);
    const randomMonth = generateRandomNumber(1,31);
    const randomYear = generateRandomNumber(2024, 2040);

    const event = {
      body: JSON.stringify({
      userId: '1',
      appointmentDate: `${randomDay}-${randomMonth}-${randomYear}`,
      name: 'Osvaldo Bazzan',
      contact: '9999999999', 
      startsAt: '14:00',
      endsAt: '15:00',
      appointmentType: 'Curso',
      appointmentPayment: 50
    })};

    const { statusCode, body } = await handler(event);

    expect(statusCode).toBe(201);
    expect(body.appointmentId).toBeDefined();
  });

});