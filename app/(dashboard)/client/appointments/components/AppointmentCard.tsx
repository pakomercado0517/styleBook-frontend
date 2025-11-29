'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatLocalDate, formatTime } from '@/lib/utils/dateUtils';
import { cancelAppointment } from '@/lib/api/appointments';
import type { Appointment } from '@/lib/types/appointments';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

interface AppointmentCardProps {
  appointment: Appointment;
}

const statusMap = {
  pending: { text: 'Pendiente', variant: 'warning' as const, icon: '⏳' },
  confirmed: { text: 'Confirmada', variant: 'success' as const, icon: '✅' },
  completed: { text: 'Completada', variant: 'info' as const, icon: '✔️' },
  cancelled: { text: 'Cancelada', variant: 'error' as const, icon: '❌' },
  no_show: { text: 'No asistió', variant: 'error' as const, icon: '🚫' },
} as const;

/**
 * AppointmentCard - Tarjeta de cita con información y acciones
 * Muestra detalles de la cita, estado y permite cancelar o ver detalles
 */
export const AppointmentCard = ({
  appointment,
}: AppointmentCardProps): ReactNode => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: handleCancelMutation, isPending: isCancelling } = useMutation(
    {
      mutationFn: () => cancelAppointment(appointment.id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        toast.success('Cita cancelada exitosamente');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al cancelar la cita');
      },
    }
  );

  // Usar fechas formateadas del backend si están disponibles, sino formatear
  const displayDate =
    appointment.formatted_dates?.start ||
    formatLocalDate(appointment.start_date_local);
  const displayTime = appointment.formatted_dates?.start
    ? appointment.formatted_dates.start.split(' ')[1] || ''
    : formatTime(appointment.start_date_local);

  // Calcular duración desde las fechas
  const startDate = new Date(appointment.start_date_local);
  const endDate = new Date(appointment.end_date_local);
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60)
  );

  const status = statusMap[appointment.status];
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const canReschedule = ['pending', 'confirmed'].includes(appointment.status);

  // Convertir final_price a number si viene como string
  const priceNumber =
    typeof appointment.final_price === 'string'
      ? parseFloat(appointment.final_price)
      : appointment.final_price;

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(priceNumber);

  // Si no hay servicio, mostrar información básica
  const serviceName =
    appointment.service?.name || `Servicio #${appointment.service_id}`;
  const hasServiceDetails = appointment.service !== undefined;

  const handleViewDetails = (): void => {
    router.push(`/client/appointments/${appointment.id}`);
  };

  const handleCancel = (): void => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      handleCancelMutation();
    }
  };

  const handleReschedule = (): void => {
    if (appointment.service_id) {
      router.push(
        `/client/book/${appointment.service_id}?reschedule=${appointment.id}`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewDetails();
    }
  };

  return (
    <div
      className="
        bg-white rounded-2xl p-6
        border border-neutral-200
        hover:border-accent-500/30
        hover:shadow-2xl hover:shadow-accent-500/10
        transition-all duration-300
        cursor-pointer
        relative
      "
      onClick={handleViewDetails}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Cita: ${serviceName}`}
    >
      <div className="flex flex-col gap-4">
        {/* Header: Servicio y Estado */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-primary-800 hover:text-accent-500 transition-colors flex-1">
            {serviceName}
          </h3>
          <Badge variant={status.variant} className="shrink-0">
            <span className="mr-1">{status.icon}</span>
            <span>{status.text}</span>
          </Badge>
        </div>

        {/* Advertencia si no hay detalles del servicio */}
        {!hasServiceDetails && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-yellow-700 font-poppins">
              ⚠️ Información del servicio no disponible
            </p>
          </div>
        )}

        {/* Información del Proveedor */}
        {appointment.service?.provider && (
          <div className="pb-3 border-b border-neutral-200">
            <p className="text-sm text-neutral-500 font-poppins mb-1">
              Proveedor
            </p>
            <p className="text-sm font-semibold text-primary-800 font-poppins">
              {appointment.service.provider.business_name}
            </p>
          </div>
        )}

        {/* Fecha y Hora */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-neutral-600 font-poppins font-medium">
                {displayDate}
              </p>
              {displayTime && (
                <p className="text-sm text-neutral-500 font-poppins">
                  {displayTime}
                </p>
              )}
            </div>
          </div>

          {durationMinutes > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <p className="text-sm text-neutral-500 font-poppins">
                Duración: {durationMinutes} minutos
              </p>
            </div>
          )}

          {appointment.employee ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <p className="text-sm text-neutral-500 font-poppins">
                Profesional: {appointment.employee.name}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <p className="text-sm text-neutral-500 font-poppins">
                Profesional ID: {appointment.employee_id}
              </p>
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="pt-3 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 font-poppins mb-1">Precio</p>
          <p className="font-playfair text-2xl font-bold text-accent-500">
            {formattedPrice}
          </p>
        </div>

        {/* Notas si existen */}
        {appointment.notes && (
          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <p className="text-xs text-neutral-500 font-poppins mb-1">Notas</p>
            <p className="text-sm text-neutral-700 font-poppins">
              {appointment.notes}
            </p>
          </div>
        )}

        {/* Acciones */}
        <div
          className="flex flex-col sm:flex-row gap-2 pt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
            aria={{ label: 'Ver detalles de la cita' }}
          >
            Ver Detalles
          </Button>

          {canReschedule && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReschedule}
              className="flex-1"
              aria={{ label: 'Reagendar cita' }}
            >
              Reagendar
            </Button>
          )}

          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isCancelling}
              className="flex-1 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
              aria={{ label: 'Cancelar cita' }}
            >
              {isCancelling ? 'Cancelando...' : 'Cancelar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
