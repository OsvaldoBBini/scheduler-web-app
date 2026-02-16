export function toDomainAppointment(appointment) {
    const splitedPk = appointment.PK.split('#');
    const userId = splitedPk[3];
    const appointmentDate = splitedPk[1];

    return {
      userId: userId,
      appointmentDate: appointmentDate,
      appointmentId: appointment.SK.split('#')[-1],
      name: appointment.name,
      contact: appointment.contact,
      startAt: appointment.startAt,
      endsAt: appointment.endsAt,
      appointmentType: appointment.appointmentType,
      appointmentPayment: appointment.appointmentPayment,
    }
}