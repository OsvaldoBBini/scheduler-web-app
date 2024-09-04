import { beforeAll } from 'vitest';
import { createLocalDynamoClient } from './utils/createLocalDynamoClient.mjs';
import { clients } from '../src/lib/Clients.mjs';
import { createAppointmentsTableCommand } from './utils/createSAppointmentsTable.mjs';
import { SAinitialData, STinitialData } from './utils/initialData.mjs';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

beforeAll(async () => {
  clients.dynamoClient = createLocalDynamoClient();
  
  try {
    await clients.dynamoClient.send(createAppointmentsTableCommand);
  } catch { /* empty */ }

  await Promise.all(SAinitialData.map((item) => {
    clients.dynamoClient.send(new PutCommand(item));
  }));

  await Promise.all(STinitialData.map((item) => {
    clients.dynamoClient.send(new PutCommand(item));
  }));

});