import { beforeAll } from 'vitest';
import { createLocalDynamoClient } from './utils/createLocalDynamoClient.mjs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { clients } from '../src/lib/Clients.mjs';
import { createAppointmentsTableCommand } from './utils/createSAppointmentsTable.mjs';
import { SAinitialData } from './utils/initialData.mjs';
import { createAppointmentTypesTableCommand } from './utils/createSAppointmentTypesTable.mjs';

beforeAll(async () => {
  clients.dynamoClient = createLocalDynamoClient();
  
  try {
    await clients.dynamoClient.send(createAppointmentsTableCommand);
    await clients.dynamoClient.send(createAppointmentTypesTableCommand);
  } catch { /* empty */ }

  await Promise.all(SAinitialData.map((item) => {
    clients.dynamoClient.send(new PutItemCommand(item));
  }));

});