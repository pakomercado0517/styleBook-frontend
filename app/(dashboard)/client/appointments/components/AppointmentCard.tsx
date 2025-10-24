'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatLocalDate } from '@/lib/utils/dateUtils';
import { cancelAppointment } from '@/lib/api/appointments';
import type { Appointment } from '@/lib/types/appointments';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

interface AppointmentCardProps {
  appointment: Appointment;
}

const statusMap = {
  pending: { text: 'Pendiente', variant: 'warning' },
  confirmed: { text: 'Confirmada', variant: 'success' },
  completed: { text: 'Completada', variant: 'info' },
  cancelled: { text: 'Cancelada', variant: 'error' },
  no_show: { text: 'No asistió', variant: 'error' },
} as const;

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const queryClient = useQueryClient();

  const { mutate: handleCancel, isPending } = useMutation({
    mutationFn: () => cancelAppointment(appointment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const formattedDate = formatLocalDate(appointment.start_date_local);
  const status = statusMap[appointment.status];
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        {/* Servicio y Estado */}
        <div className="flex items-start justify-between">
          <h3 className="font-playfair text-xl font-bold text-primary-800">
            {appointment.service?.name}
          </h3>
          <Badge variant={status.variant}>{status.text}</Badge>
        </div>

        {/* Fecha y Hora */}
        <div className="flex flex-col gap-1">
          <p className="text-neutral-600">{formattedDate}</p>
          <p className="text-sm text-neutral-500">
            Duración: {appointment.service?.duration} minutos
          </p>
        </div>

        {/* Precio */}
        <p className="text-lg font-semibold text-primary-800">
          ${appointment.final_price}
        </p>

        {/* Acciones */}
        {canCancel && (
          <Button
            variant="outline"
            onClick={() => handleCancel()}
            disabled={isPending}
            className="mt-2"
          >
            {isPending ? 'Cancelando...' : 'Cancelar Cita'}
          </Button>
        )}
      </div>
    </Card>
  );
}
