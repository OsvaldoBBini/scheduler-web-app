import { beforeAll, beforeEach } from 'vitest';
import { createAppointmentsTableCommand, createLocalDynamoClient, initialData } from './utils/createLocalDynamoClient.mjs';
import { DeleteItemCommand, ListTablesCommand, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { clients } from '../src/lambdas/lib/Cients.mjs';

beforeAll(async () => {
  clients.dynamoClient = createLocalDynamoClient();

  const listTableCommand = new ListTablesCommand({})
  const { TableNames } = await clients.dynamoClient.send(listTableCommand);

  if (TableNames.length === 0) {
    await clients.dynamoClient.send(createAppointmentsTableCommand);
  }
 
});

beforeEach(async () => {
  await Promise.all(initialData.map((item) => {
    clients.dynamoClient.send(new PutItemCommand(item));
  }));

  return async () => {
    const scanCommand = new ScanCommand({TableName: 'SAppointments'});
    const allItems = await clients.dynamoClient.send(scanCommand); 
    await Promise.all(allItems.Items.map((item) => {
    const command = {
      TableName: 'SAppointments',
      Key: {
        userId: { S: item.userId.S },
        appointmentId: { S: item.appointmentId.S }
      }
    }

    clients.dynamoClient.send(new DeleteItemCommand(command));
    }))};
});

