export const SAinitialData = [
  {
    TableName: 'SAppointments',
    Item: 
    {
      GSI1PK: { S: 'USER#johnone@gmail.com' },
      GSI1SK: { S: 'APPO#0000001' },
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
      GSI1PK: { S: 'USER#johntwo@gmail.com' },
      GSI1SK: { S: 'APPO#0000001' },
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
      GSI1PK: { S: 'USER#johnthree@gmail.com' },
      GSI1SK: { S: 'APPO#0000001' },
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
      GSI1PK: { S: 'USER#johnfour@gmail.com' },
      GSI1SK: { S: 'APPO#0000001' },
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
      GSI1PK: { S: 'USER#johnfour@gmail.com' },
      GSI1SK: { S: 'APPO#0000002' },
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
      GSI1PK: { S: 'USER#johnfour@gmail.com' },
      GSI1SK: { S: 'APPO#0000003' },
      appointmentDate: { S: '23/05/2050' },
      name: { S: 'John Doe' },
      phoneNumber: { S: '999999999' },
      startsAt: { N: 180 },
      endsAt: { N: 240 },
      appointmentType: { S: 'Express' },
      confirmed: { S: false },
      appointmentPayment: { N: 120 }
    },
  },
]

export const STinitialData = [
  {
    TableName: 'SAppointments',
    Item:
    {
      GSI1PK: { S: 'USER#johnone@gmail.com' },
      GSI1SK: { S: 'TYPE#0000001' }, 
      appointmentTypeName: { S: 'Express' }, 
      appointmentTypePrice: { N: 90 }, 
    }
  },
  {
    TableName: 'SAppointments',
    Item:
    {
      GSI1PK: { S: 'USER#johntwo@gmail.com' },
      GSI1SK: { S: 'TYPE#0000001' },
      appointmentTypeName: { S: 'Curso' }, 
      appointmentTypePrice: { N: 800 }, 
    }
  },
  {
    TableName: 'SAppointments',
    Item:
    {
      GSI1PK: { S: 'USER#johnthree@gmail.com' },
      GSI1SK: { S: 'TYPE#0000001' }, 
      appointmentTypeName: { S: 'Express' }, 
      appointmentTypePrice: { N: 90 }, 
    }
  }
]