import { CreateTableCommand } from "@aws-sdk/client-dynamodb"

const SAtable = {
  TableName: 'SAppointmentsTable',
  KeySchema: [
    { AttributeName: 'PK', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'SK', KeyType: 'RANGE' } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'PK', AttributeType: 'S' },
    { AttributeName: 'SK', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  BillingMode: 'PROVISIONED'
};

export const createAppointmentsTableCommand = new CreateTableCommand(SAtable);