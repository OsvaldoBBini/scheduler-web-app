import { beforeAll } from 'vitest';
import { createAppointmentsTableCommand, createLocalDynamoClient, initialData } from './utils/createLocalDynamoClient.mjs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { clients } from '../src/lambdas/lib/Cients.mjs';

clients.dynamoClient = createLocalDynamoClient();

const createTables = async () => {
  try {
    await clients.dynamoClient.send(createAppointmentsTableCommand);
  } catch { /* empty */ }
}

createTables();

beforeAll(async () => {

  await Promise.all(initialData.map((item) => {
    clients.dynamoClient.send(new PutItemCommand(item));
  }));

});