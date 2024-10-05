export const SAinitialData = [
  {
    TableName: 'SAppointmentsTable',
    Item: 
    {
      PK: 'DATE#23-05-2050',
      SK: 'APPO#0000001',
      GSI1PK: 'USER#1',
      GSI1SK: 'APPO#0000001',
      name: 'John Doe',
      phoneNumber: '999999999',
      startsAt:  60,
      endsAt:  120,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment:  '120'
    },
  },
  {
    TableName: 'SAppointmentsTable',
    Item: 
    {
      PK: 'DATE#23-05-2051',
      SK: 'APPO#0000001',
      GSI1PK: 'USER#2',
      GSI1SK: 'APPO#0000001',
      name: 'John Doe',
      phoneNumber: '999999999',
      startsAt:  60,
      endsAt:  120,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment:  120
    },
  },
  {
    TableName: 'SAppointmentsTable',
    Item: 
    {
      PK: 'DATE#23-05-2052',
      SK: 'APPO#0000001',
      GSI1PK: 'USER#3',
      GSI1SK: 'APPO#0000001',
      name: 'John Doe',
      phoneNumber: '999999999',
      startsAt:  60,
      endsAt:  120,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment:  120
    },
  },
  {
    TableName: 'SAppointmentsTable',
    Item: 
    {
      PK: 'DATE#23-05-2053',
      SK: 'APPO#0000001',
      GSI1PK: 'USER#4',
      GSI1SK: 'APPO#0000001',
      name: 'John Doe',
      phoneNumber: '999999999',
      startsAt:  60,
      endsAt:  120,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment:  120
    },
  },
  {
    TableName: 'SAppointmentsTable',
    Item: 
    {
      PK: 'DATE#23-05-2053',
      SK: 'APPO#0000002',
      GSI1PK: 'USER#4',
      GSI1SK: 'APPO#0000002',
      name: 'John Doe',
      phoneNumber: '999999999',
      startsAt:  120,
      endsAt:  180,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment:  120
    },
  },
  {
    TableName: 'SAppointmentsTable',
    Item: 
    {
      PK: 'DATE#23-05-2053',
      SK: 'APPO#0000003',
      GSI1PK: 'USER#4',
      GSI1SK: 'APPO#0000003',
      name: 'John Doe',
      phoneNumber: '999999999',
      startsAt:  180,
      endsAt:  240,
      appointmentType: 'Express',
      confirmed: false,
      appointmentPayment:  120
    },
  },
]

export const STinitialData = [
  {
    TableName: 'SAppointmentsTable',
    Item:
    {
      PK: 'USER#1',
      SK: 'TYPE#0000001', 
      appointmentTypeName: 'Express', 
      appointmentTypePrice:  90, 
    }
  },
  {
    TableName: 'SAppointmentsTable',
    Item:
    {
      PK: 'USER#2',
      SK: 'TYPE#0000001',
      appointmentTypeName: 'Curso', 
      appointmentTypePrice:  800, 
    }
  },
  {
    TableName: 'SAppointmentsTable',
    Item:
    {
      PK: 'USER#3',
      SK: 'TYPE#0000001', 
      appointmentTypeName: 'Express', 
      appointmentTypePrice:  90, 
    }
  }
]