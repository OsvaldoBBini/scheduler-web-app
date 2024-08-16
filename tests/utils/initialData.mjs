export const SAinitialData = [
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
      userId: { S: '123459' },
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
      userId: { S: '123457' },
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
      userId: { S: '123458' },
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
      userId: { S: '123458' },
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
      userId: { S: '123458' },
      appointmentId: { S: '0000003' },
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
    TableName: 'SAppointmentTypes',
    Item:
    {
      userId: { S: '1234567' },
      appointmentTypeId: { S: '0000001' }, 
      appointmentTypeName: { S: 'Express' }, 
      appointmentTypePrice: { N: 90 }, 
    }
  },
  {
    TableName: 'SAppointmentTypes',
    Item:
    {
      userId: { S: '1234568' },
      appointmentTypeId: { S: '0000001' }, 
      appointmentTypeName: { S: 'Curso' }, 
      appointmentTypePrice: { N: 800 }, 
    }
  },
  {
    TableName: 'SAppointmentTypes',
    Item:
    {
      userId: { S: '1234569' },
      appointmentTypeId: { S: '0000001' }, 
      appointmentTypeName: { S: 'Express' }, 
      appointmentTypePrice: { N: 90 }, 
    }
  }
]