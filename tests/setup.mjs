import { beforeAll } from 'vitest';
import { createAppointmentsTableCommand, createLocalDynamoClient, initialData } from './utils/createLocalDynamoClient.mjs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { clients } from '../src/lambdas/lib/Cients.mjs';


beforeAll(async () => {
  clients.dynamoClient = createLocalDynamoClient();
  
  try {
    await clients.dynamoClient.send(createAppointmentsTableCommand);
  } catch { /* empty */ }

  await Promise.all(initialData.map((item) => {
    clients.dynamoClient.send(new PutItemCommand(item));
  }));

});