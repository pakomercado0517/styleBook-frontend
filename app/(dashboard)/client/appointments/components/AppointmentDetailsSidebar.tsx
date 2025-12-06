'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAppointment, cancelAppointment } from '@/lib/api/appointments';
import type { Appointment } from '@/lib/types/appointments';

interface AppointmentDetailsSidebarProps {
  appointmentId: number;
  onClose: () => void;
}

const statusLabels: Record<string, string> = {
  pending: 'Próxima',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

/**
 * AppointmentDetailsSidebar - Sidebar con detalles de la cita seleccionada
 * Versión desktop del sidebar de detalles
 */
export const AppointmentDetailsSidebar = ({
  appointmentId,
  onClose,
}: AppointmentDetailsSidebarProps): ReactNode => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const result = await getAppointment(appointmentId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: handleCancelMutation, isPending: isCancelling } = useMutation({
    mutationFn: () => cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      toast.success('Cita cancelada exitosamente');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cancelar la cita');
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <p className="text-red-400 font-poppins text-center">
          No se pudo cargar la cita
        </p>
      </div>
    );
  }

  // Información del servicio
  const serviceName = appointment.service?.name || `Servicio #${appointment.service_id}`;
  const serviceImage = appointment.service?.image_url;

  // Información del proveedor
  const providerName = appointment.provider?.business_name || 'Salón';
  const providerBusinessType = appointment.provider?.business_type || '';

  // Formatear fecha y hora
  const appointmentDate = new Date(appointment.start_date_local);
  const formattedDate = format(appointmentDate, "EEEE, d 'de' MMMM", { locale: es });
  const formattedTime = format(appointmentDate, "HH:mm", { locale: es });

  // Estado
  const statusLabel = statusLabels[appointment.status] || appointment.status;
  const canReschedule = ['pending', 'confirmed'].includes(appointment.status);
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const isCompleted = appointment.status === 'completed';
  const canRebook = isCompleted && appointment.service_id;

  const handleReschedule = (): void => {
    if (appointment.service_id) {
      router.push(`/client/book/${appointment.service_id}?reschedule=${appointment.id}`);
    }
  };

  const handleRebook = (): void => {
    if (appointment.service_id) {
      // Navegar al flujo de reserva con el servicio y empleado pre-seleccionados
      const params = new URLSearchParams();
      if (appointment.employee_id) {
        params.append('employee', appointment.employee_id.toString());
      }
      router.push(`/client/book/${appointment.service_id}?${params.toString()}`);
    }
  };

  const handleCancel = (): void => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      handleCancelMutation();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header del sidebar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-white/5 z-10">
        <h2 className="text-xl font-bold text-white font-playfair">Detalles de la Cita</h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
          type="button"
        >
          <X className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Contenido scrollable */}
      <div className="px-6 py-6">
        {/* Imagen del servicio */}
        <div className="w-full h-48 rounded-xl overflow-hidden mb-6">
          {serviceImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={serviceImage}
              alt={serviceName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
              <span className="text-4xl">💇</span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="space-y-4">
          {/* Servicio */}
          <div>
            <p className="text-sm font-semibold text-neutral-400 font-poppins mb-1">Servicio</p>
            <p className="text-base font-bold text-white font-playfair">{serviceName}</p>
          </div>

          {/* Proveedor */}
          <div>
            <p className="text-sm font-semibold text-neutral-400 font-poppins mb-1">Proveedor</p>
            <p className="text-base text-white font-poppins">
              {providerName}
              {providerBusinessType && ` en ${providerBusinessType}`}
            </p>
          </div>

          {/* Fecha y Hora */}
          <div>
            <p className="text-sm font-semibold text-neutral-400 font-poppins mb-1">
              Fecha y Hora
            </p>
            <p className="text-base text-white font-poppins">
              {formattedDate} a las {formattedTime}
            </p>
          </div>

          {/* Estado */}
          <div>
            <p className="text-sm font-semibold text-neutral-400 font-poppins mb-1">Estado</p>
            <p className="text-base text-white font-poppins">{statusLabel}</p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="px-6 py-4 border-t border-white/10 space-y-3 sticky bottom-0 bg-white/5">
        <button
          onClick={() => router.push(`/client/appointments/${appointmentId}`)}
          className="w-full h-12 rounded-lg font-semibold font-poppins transition-colors"
          style={{
            backgroundColor: '#D4AF37',
            color: '#1A1A1A',
          }}
          type="button"
        >
          Ver Detalles
        </button>
        {canRebook && (
          <button
            onClick={handleRebook}
            className="w-full h-12 rounded-lg font-semibold font-poppins transition-colors"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1A1A1A',
            }}
            type="button"
          >
            Re-reservar
          </button>
        )}
        {canReschedule && (
          <button
            onClick={handleReschedule}
            className="w-full h-12 rounded-lg font-semibold font-poppins transition-colors"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1A1A1A',
            }}
            type="button"
          >
            Reprogramar
          </button>
        )}
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors disabled:opacity-50"
            type="button"
          >
            {isCancelling ? 'Cancelando...' : 'Cancelar Cita'}
          </button>
        )}
      </div>
    </div>
  );
};

