import { beforeEach, expect, it, describe } from 'vitest'
import { handler, clients } from './index.mjs';

describe('Create Appointment', () => {

  beforeEach(() => clients.dynamoClient = 'oi');

  it('should return oi', async () => {
    const { body } = await handler();
    expect(body).toBe('oi');
  });

});