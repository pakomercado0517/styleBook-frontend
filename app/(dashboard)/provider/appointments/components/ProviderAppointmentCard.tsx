'use client';

import type { ReactNode } from 'react';
import { Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Appointment } from '@/lib/types/appointments';
import { useUpdateAppointment, useCancelAppointment, useConfirmAppointment } from '@/lib/hooks/useAppointments';
import { toast } from 'sonner';

interface ProviderAppointmentCardProps {
  appointment: Appointment;
}

/**
 * Card de appointment para proveedor - Diseño mobile
 * Muestra información del cliente, servicio, estado y acciones
 */
export function ProviderAppointmentCard({
  appointment,
}: ProviderAppointmentCardProps): ReactNode {
  const updateAppointment = useUpdateAppointment();
  const cancelAppointment = useCancelAppointment();
  const confirmAppointment = useConfirmAppointment();

  // Información del cliente
  const clientName =
    appointment.client?.name || `Cliente #${appointment.client_id}`;

  // Información del servicio
  const serviceName =
    appointment.service?.name || `Servicio #${appointment.service_id}`;

  // Información del empleado
  const employeeName =
    appointment.employee?.name || `Empleado #${appointment.employee_id}`;

  // Formatear fecha y hora
  const appointmentDate = new Date(appointment.start_date_local);
  const startTime = format(appointmentDate, 'HH:mm', { locale: es });
  const endDate = new Date(appointment.end_date_local);
  const endTime = format(endDate, 'HH:mm', { locale: es });

  // Calcular duración
  const durationMinutes = Math.round(
    (endDate.getTime() - appointmentDate.getTime()) / (1000 * 60)
  );

  // Estado y colores
  const getStatusConfig = () => {
    switch (appointment.status) {
      case 'confirmed':
        return {
          text: 'Confirmada',
          bgColor: 'bg-green-500',
          textColor: 'text-white',
        };
      case 'pending':
        return {
          text: 'Pendiente',
          bgColor: 'bg-accent-500',
          textColor: 'text-primary-900',
        };
      case 'cancelled':
        return {
          text: 'Cancelada',
          bgColor: 'bg-red-700',
          textColor: 'text-white',
        };
      default:
        return {
          text: appointment.status,
          bgColor: 'bg-neutral-500',
          textColor: 'text-white',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Handlers
  const handleConfirm = (): void => {
    confirmAppointment.mutate(appointment.id, {
      onSuccess: () => {
        toast.success('Cita confirmada exitosamente');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al confirmar la cita');
      },
    });
  };

  const handleCancel = (): void => {
    cancelAppointment.mutate(appointment.id, {
      onSuccess: () => {
        toast.success('Cita cancelada exitosamente');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al cancelar la cita');
      },
    });
  };

  const handleReschedule = (): void => {
    // TODO: Implementar lógica de reprogramación
    toast.info('Función de reprogramación próximamente');
  };

  const handleViewDetails = (): void => {
    // TODO: Navegar a detalles de la cita
    toast.info('Ver detalles de la cita');
  };

  // Determinar botones según el estado
  const showActions = appointment.status !== 'cancelled';
  const isPending = appointment.status === 'pending';
  const isConfirmed = appointment.status === 'confirmed';

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      {/* Header con nombre del cliente y estado */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white font-poppins mb-1 truncate">
            {clientName}
          </h3>
          <p className="text-sm text-neutral-300 font-poppins truncate">{serviceName}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} text-xs font-semibold font-poppins flex-shrink-0 ml-2`}
        >
          {statusConfig.text}
        </div>
      </div>

      {/* Información de hora y empleado */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-500 flex-shrink-0" strokeWidth={2} />
          <span className="text-sm text-white font-poppins">
            {startTime} - {endTime} ({durationMinutes} min)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-accent-500 flex-shrink-0" strokeWidth={2} />
          <span className="text-sm text-white font-poppins truncate">& {employeeName}</span>
        </div>
      </div>

      {/* Botones de acción */}
      {showActions && (
        <div className="flex items-center gap-3 pt-3 border-t border-white/10">
          <button
            onClick={handleCancel}
            className="flex-1 text-sm font-medium text-red-400 font-poppins hover:text-red-300 transition-colors"
            disabled={cancelAppointment.isPending}
            type="button"
          >
            Cancelar
          </button>
          {isPending && (
            <button
              onClick={handleConfirm}
              className="flex-1 text-sm font-medium text-green-400 font-poppins hover:text-green-300 transition-colors"
              disabled={confirmAppointment.isPending}
              type="button"
            >
              Confirmar
            </button>
          )}
          {isConfirmed && (
            <>
              <button
                onClick={handleReschedule}
                className="text-sm font-medium font-poppins transition-colors"
                style={{ color: '#D4AF37' }}
                type="button"
              >
                Reprogramar
              </button>
              {/* Botón Ver Detalles - Opcional según la imagen */}
              <button
                onClick={handleViewDetails}
                className="text-sm font-medium font-poppins transition-colors"
                style={{ color: '#D4AF37' }}
                type="button"
              >
                Ver Detalles
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

