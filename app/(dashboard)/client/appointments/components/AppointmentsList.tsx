'use client';

import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/lib/api/appointments';
import type { Appointment } from '@/lib/types/appointments';
import { AppointmentCard } from './AppointmentCard';
import { Card } from '@/components/Card';

export function AppointmentsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAppointments(),
  });

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-neutral-600">Cargando citas...</p>
      </Card>
    );
  }

  if (error || !data?.success) {
    const errorMessage =
      data && !data.success ? data.error : 'Error al cargar las citas';

    // Si no hay sesión, mostrar un mensaje más amigable
    if (errorMessage === 'No hay sesión activa') {
      return (
        <Card className="p-8 text-center">
          <p className="text-neutral-600">Inicia sesión para ver tus citas</p>
        </Card>
      );
    }

    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">{errorMessage}</p>
      </Card>
    );
  }

  const { appointments, pagination } = data.data.data;
  const { total } = pagination;

  if (total === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-neutral-600">No tienes citas programadas</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {appointments.map((appointment: Appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}
