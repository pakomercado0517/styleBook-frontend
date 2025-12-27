'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cancelAppointment } from '@/lib/api/appointments';
import type { Appointment } from '@/lib/types/appointments';
import { CreateReviewForm } from './CreateReviewForm';
import { useMyReviews } from '@/lib/hooks/useReviews';

interface AppointmentCardProps {
  appointment: Appointment;
  onSelect?: (id: number) => void;
  isSelected?: boolean;
}

const statusLabels: Record<string, string> = {
  pending: 'Próxima',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

/**
 * AppointmentCard - Tarjeta de cita rediseñada
 * Estilo mobile-first con imagen, información y botones de acción
 */
export const AppointmentCard = ({
  appointment,
  onSelect,
  isSelected = false,
}: AppointmentCardProps): ReactNode => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const { mutate: handleCancelMutation, isPending: isCancelling } = useMutation({
    mutationFn: () => cancelAppointment(appointment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita cancelada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cancelar la cita');
    },
  });

  // Verificar si ya existe una reseña para esta cita
  const { data: myReviewsData } = useMyReviews({ limit: 100 });
  const hasReview = myReviewsData?.data?.some(
    (review) => review.appointment_id === appointment.id
  );

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
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const isCompleted = appointment.status === 'completed';
  const canRebook = isCompleted && appointment.service_id;
  const canReview = isCompleted && !hasReview;

  const handleViewDetails = (): void => {
    if (onSelect) {
      onSelect(appointment.id);
    } else {
      router.push(`/client/appointments/${appointment.id}`);
    }
  };

  const handleCardClick = (): void => {
    if (onSelect) {
      onSelect(appointment.id);
    }
  };

  const handleCancel = (): void => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      handleCancelMutation();
    }
  };

  const handleRebook = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (appointment.service_id) {
      // Navegar al flujo de reserva con el servicio y empleado pre-seleccionados
      const params = new URLSearchParams();
      if (appointment.employee_id) {
        params.append('employee', appointment.employee_id.toString());
      }
      router.push(`/client/book/${appointment.service_id}?${params.toString()}`);
    }
  };

  const handleOpenReviewForm = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsReviewFormOpen(true);
  };

  return (
    <div
      className={`
        bg-white/5 rounded-xl overflow-hidden border mb-4 transition-all cursor-pointer
        ${isSelected ? 'border-accent-500' : 'border-white/10'}
      `}
      onClick={onSelect ? handleCardClick : undefined}
    >
      {/* Estado - Mobile */}
      <div className="px-4 pt-4 md:hidden">
        <span className="text-sm font-semibold text-white font-poppins">{statusLabel}</span>
      </div>

      {/* Imagen del servicio */}
      <div className="w-full h-48 rounded-xl overflow-hidden mt-3 mx-4">
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
      <div className="px-4 pt-4 pb-4">
        {/* Título del servicio con badge de estado - Desktop */}
        <div className="hidden md:flex items-start justify-between gap-3 mb-2">
          <h3 className="text-xl font-bold text-white font-playfair flex-1">{serviceName}</h3>
          <span className="text-xs font-semibold text-white font-poppins bg-white/10 px-3 py-1 rounded-full">
            {statusLabel}
          </span>
        </div>
        {/* Título del servicio - Mobile */}
        <h3 className="text-xl font-bold text-white font-playfair mb-2 md:hidden">
          {serviceName}
        </h3>

        {/* Proveedor/Localización */}
        <p className="text-sm text-neutral-300 font-poppins mb-3">
          por {providerName}
          {providerBusinessType && ` en ${providerBusinessType}`}
        </p>

        {/* Fecha y hora */}
        <p className="text-sm text-neutral-300 font-poppins mb-4">
          {formattedDate} a las {formattedTime}
        </p>

        {/* Botones de acción - Solo en móvil */}
        <div className="flex gap-3 md:hidden">
          {canCancel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              disabled={isCancelling}
              className="flex-1 h-11 rounded-lg bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors disabled:opacity-50"
              type="button"
            >
              {isCancelling ? 'Cancelando...' : 'Cancelar'}
            </button>
          )}
          {canReview && (
            <button
              onClick={handleOpenReviewForm}
              className="flex-1 h-11 rounded-lg font-semibold font-poppins transition-colors"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              Dejar Reseña
            </button>
          )}
          {canRebook && !canReview && (
            <button
              onClick={handleRebook}
              className="flex-1 h-11 rounded-lg font-semibold font-poppins transition-colors"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              Re-reservar
            </button>
          )}
          {!canRebook && !canReview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="flex-1 h-11 rounded-lg font-semibold font-poppins transition-colors"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>

      {/* Modal de reseña */}
      {isCompleted && (
        <CreateReviewForm
          appointment={appointment}
          isOpen={isReviewFormOpen}
          onClose={() => {
            setIsReviewFormOpen(false);
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
          }}
        />
      )}
    </div>
  );
};
