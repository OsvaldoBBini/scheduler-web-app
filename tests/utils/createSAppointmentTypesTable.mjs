import { CreateTableCommand } from "@aws-sdk/client-dynamodb"

const STtable = {
  TableName: 'SAppointmentTypes',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'appointmentTypeId', KeyType: 'RANGE' } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'appointmentTypeId', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  BillingMode: 'PROVISIONED'
};

export const createAppointmentTypesTableCommand = new CreateTableCommand(STtable);