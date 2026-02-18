export function toDomainAppointment(appointment) {
    const splitedPk = appointment.PK.split('USER#');
    const userId = splitedPk[1].split('#')[0];
    const appointmentDate = splitedPk[0].split('DATE#')[1];

    return {
      userId: userId,
      appointmentDate: appointmentDate,
      appointmentId: appointment.SK.split('#')[2],
      name: appointment.name,
      contact: appointment.contact,
      startAt: appointment.startAt,
      endsAt: appointment.endsAt,
      appointmentType: appointment.appointmentType,
      appointmentPayment: appointment.appointmentPayment,
    }
}