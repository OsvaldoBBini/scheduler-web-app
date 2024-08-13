import { CreateTableCommand } from "@aws-sdk/client-dynamodb"

const SAtable = {
  TableName: 'SAppointments',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'appointmentId', KeyType: 'RANGE' } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'appointmentId', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  BillingMode: 'PROVISIONED'
};

export const createAppointmentsTableCommand = new CreateTableCommand(SAtable);