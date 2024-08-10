import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb"

export function createLocalDynamoClient() {

  const clients = new DynamoDBClient(
    {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      credentials : {
        accessKeyId: '2uz49p',
        secretAccessKey: 'c7g4g'
      }
    });

  return clients;
};

const table = {
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

export const initialData = [
  {
    TableName: 'SAppointments',
    Item: 
    {
      userId: { S: '123456' },
      appointmentId: { S: '0000001' },
      appointmentDate: { S: '23/05/2050' },
      name: { S: 'John Doe' },
      phoneNumber: { S: '999999999' },
      startsAt: { N: 60 },
      endsAt: { N: 120 },
      appointmentType: { S: 'Express' },
      confirmed: { S: false },
      appointmentPayment: { N: 120 }
    },
  },
  {
    TableName: 'SAppointments',
    Item: 
    {
      userId: { S: '123456' },
      appointmentId: { S: '0000002' },
      appointmentDate: { S: '23/05/2050' },
      name: { S: 'John Doe' },
      phoneNumber: { S: '999999999' },
      startsAt: { N: 120 },
      endsAt: { N: 180 },
      appointmentType: { S: 'Express' },
      confirmed: { S: false },
      appointmentPayment: { N: 120 }
    },
  },
  {
    TableName: 'SAppointments',
    Item: 
    {
      userId: { S: '1234567' },
      appointmentId: { S: '0000001' },
      appointmentDate: { S: '23/05/2050' },
      name: { S: 'John Doe' },
      phoneNumber: { S: '999999999' },
      startsAt: { N: 60 },
      endsAt: { N: 120 },
      appointmentType: { S: 'Express' },
      confirmed: { S: false },
      appointmentPayment: { N: 120 }
    },
  },
]


export const deleteTableCommand = new DeleteTableCommand({TableName: table.TableName});
export const createTableCommand = new CreateTableCommand(table);
