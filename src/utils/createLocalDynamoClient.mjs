import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export function createLocalDynamoClient() {
  const client = new DynamoDBClient(
    {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      credentials : {
        accessKeyId: '2uz49p',
        secretAccessKey: 'c7g4g'
      }
    });

  return client;
};

import { CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb"

const table = {
  TableName: 'SAppointments',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'appointmentId', KeyType: 'RANGE' } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'appointmentId', AttributeType: 'S' },
    { AttributeName: 'appointmentDate', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: 'AppointmentsByDate',
      KeySchema: [
        { AttributeName: 'appointmentDate', KeyType: 'HASH' },
        { AttributeName: 'appointmentId', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'INCLUDE',
        NonKeyAttributes: ['startsAt', 'endsAt']
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  BillingMode: 'PROVISIONED'
};

export const deleteTableCommand = new DeleteTableCommand({TableName: table.TableName});
export const createTableCommand = new CreateTableCommand(table);
