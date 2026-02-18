export function defaultAppointment(...props) {
  return {
    PK: 'DATE#01-01-2026USER#user-id',
    SK: 'APPO#random-id',
    GSI1PK: 'APPOINTMENT#USER#user-id',
    GSI1SK: 'MONTH#01#YEAR#2026',
    name: 'test-user',
    contact: '55999999999',
    startsAt: '14:00',
    endsAt: '15:00',
    appointmentType: 'Curso',
    appointmentPayment: 50,
  ...props
  }
}