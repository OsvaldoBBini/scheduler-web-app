import { beforeEach } from 'vitest';
import { createLocalDynamoClient, deleteTableCommand, createTableCommand, initialData } from './utils/createLocalDynamoClient.mjs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { clients } from '../src/lambdas/lib/Cients.mjs';

beforeEach(async () => {
  clients.dynamoClient = createLocalDynamoClient();
  await clients.dynamoClient.send(createTableCommand);

  await Promise.all(initialData.map((item) => {
    clients.dynamoClient.send(new PutItemCommand(item));
  }));

  return async () => await clients.dynamoClient.send(deleteTableCommand);
});

