import { afterEach, beforeEach } from 'vitest';
import { createAppointmentsTableCommand, createLocalDynamoClient, initialData } from './utils/createLocalDynamoClient.mjs';
import { PutItemCommand, ScanCommand,DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { clients } from '../src/lambdas/lib/Cients.mjs';

clients.dynamoClient = createLocalDynamoClient();

const createTables = async () => {
  try {
    await clients.dynamoClient.send(createAppointmentsTableCommand);
  } catch { /* empty */ }
}

createTables();

beforeEach(async () => {

  await Promise.all(initialData.map((item) => {
    clients.dynamoClient.send(new PutItemCommand(item));
  }));

});

afterEach(async () => {
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
    }));
});