import { CreateTableCommand } from "@aws-sdk/client-dynamodb"

const SAtable = {
  TableName: 'SAppointments',
  KeySchema: [
    { AttributeName: 'GSI1PK', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'GSI1SK', KeyType: 'RANGE' } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'GSI1PK', AttributeType: 'S' },
    { AttributeName: 'GSI1SK', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  BillingMode: 'PROVISIONED'
};

export const createAppointmentsTableCommand = new CreateTableCommand(SAtable);