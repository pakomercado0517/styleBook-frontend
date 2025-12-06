'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, MoreVertical, MapPin, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAppointment, cancelAppointment } from '@/lib/api/appointments';

interface AppointmentDetailsProps {
  appointmentId: number;
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

/**
 * AppointmentDetails - Vista detallada de una cita
 * Rediseño mobile-first con estilo Luxe Noir
 */
export const AppointmentDetails = ({
  appointmentId,
}: AppointmentDetailsProps): ReactNode => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: appointment,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const result = await getAppointment(appointmentId);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const { mutate: handleCancelMutation, isPending: isCancelling } = useMutation(
    {
      mutationFn: () => cancelAppointment(appointmentId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({
          queryKey: ['appointment', appointmentId],
        });
        toast.success('Cita cancelada exitosamente');
        router.push('/client/appointments');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al cancelar la cita');
      },
    }
  );

  const handleBack = (): void => {
    router.back();
  };

  const handleReschedule = (): void => {
    if (appointment?.service_id) {
      router.push(
        `/client/book/${appointment.service_id}?reschedule=${appointmentId}`
      );
    }
  };

  const handleRebook = (): void => {
    if (appointment?.service_id) {
      // Navegar al flujo de reserva con el servicio y empleado pre-seleccionados
      const params = new URLSearchParams();
      if (appointment.employee_id) {
        params.append('employee', appointment.employee_id.toString());
      }
      router.push(
        `/client/book/${appointment.service_id}?${params.toString()}`
      );
    }
  };

  const handleCancel = (): void => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      handleCancelMutation();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold text-white font-playfair">
            Detalles de la Cita
          </h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !appointment) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error al cargar la cita';

    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Volver"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold text-white font-playfair">
            Detalles de la Cita
          </h1>
          <div className="w-10"></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-400 font-poppins mb-4">{errorMessage}</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg bg-accent-500 text-primary-900 font-semibold font-poppins"
              type="button"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Información del servicio
  const serviceName =
    appointment.service?.name || `Servicio #${appointment.service_id}`;

  // Información del proveedor
  const providerName = appointment.provider?.business_name || 'Salón';
  const providerAddress = appointment.provider?.address || '';
  const providerCity = appointment.provider?.city || '';
  const providerCountry = appointment.provider?.country || '';
  const fullAddress = [providerAddress, providerCity, providerCountry]
    .filter(Boolean)
    .join(', ');

  // Formatear fecha y hora
  const appointmentDate = new Date(appointment.start_date_local);
  const formattedDate = format(appointmentDate, 'EEEE, d MMM, HH:mm', {
    locale: es,
  });

  // Calcular duración
  const startDate = new Date(appointment.start_date_local);
  const endDate = new Date(appointment.end_date_local);
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60)
  );
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const formattedDuration =
    hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

  // Formatear precio
  const priceNumber =
    typeof appointment.final_price === 'string'
      ? parseFloat(appointment.final_price)
      : appointment.final_price || 0;
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(priceNumber);

  // Estado
  const statusLabel = statusLabels[appointment.status] || appointment.status;
  const canReschedule = ['pending', 'confirmed'].includes(appointment.status);
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const isCompleted = appointment.status === 'completed';
  const canRebook = isCompleted && appointment.service_id;

  // Información del empleado
  const employeeName = appointment.employee?.name || 'No asignado';

  // Información del proveedor para rating
  const providerRating = appointment.provider?.average_rating || 0;
  const reviewsCount: number = 254; // Valor por defecto, se podría obtener del backend si está disponible

  return (
    <div className="min-h-screen bg-[#201d12] flex flex-col">
      {/* Header - Mobile */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 md:hidden">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Volver"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
        <h1 className="text-xl font-bold text-white font-playfair">
          Detalles de la Cita
        </h1>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Más opciones"
          type="button"
        >
          <MoreVertical className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Desktop Layout - Dos columnas */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Columna Izquierda - Detalles de la Cita */}
            <div className="space-y-6">
              {/* Header con título y subtítulo - Desktop */}
              <div className="hidden md:block">
                <h1 className="text-3xl lg:text-4xl font-bold text-white font-playfair mb-2">
                  Detalles de la Cita
                </h1>
                <p className="text-base text-neutral-300 font-poppins">
                  Revisa los detalles de tu próxima cita.
                </p>
              </div>

              {/* Card de Resumen de la Cita */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 relative">
                {/* Badge de estado en esquina superior izquierda */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white font-poppins">
                    {statusLabel}
                  </span>
                </div>

                {/* Título del servicio */}
                <h2 className="text-2xl md:text-3xl font-bold text-white font-playfair mb-6 pt-8 pr-20">
                  {serviceName}
                </h2>

                {/* Información de la cita */}
                <div className="space-y-4">
                  {/* Fecha y Hora */}
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-sm font-medium text-white font-poppins">
                      Fecha y Hora
                    </span>
                    <span className="text-sm text-white font-poppins">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Profesional */}
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-sm font-medium text-white font-poppins">
                      Profesional
                    </span>
                    <span className="text-sm text-white font-poppins">
                      {employeeName}
                    </span>
                  </div>

                  {/* Duración */}
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-sm font-medium text-white font-poppins">
                      Duración
                    </span>
                    <span className="text-sm text-white font-poppins">
                      {formattedDuration}
                    </span>
                  </div>

                  {/* Precio */}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-white font-poppins">
                      Precio
                    </span>
                    <span
                      className="text-lg font-bold font-poppins"
                      style={{ color: '#D4AF37' }}
                    >
                      {formattedPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Información del Proveedor y Acciones */}
            <div className="space-y-6">
              {/* Card de Información del Proveedor */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white font-playfair mb-4">
                  Información del Proveedor
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                  {/* Información del proveedor */}
                  <div className="flex-1 space-y-3">
                    <h4 className="text-lg font-bold text-white font-playfair">
                      {providerName}
                    </h4>
                    {fullAddress && (
                      <p className="text-sm text-neutral-300 font-poppins">
                        {fullAddress}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Star
                        className="w-5 h-5"
                        style={{ color: '#D4AF37' }}
                        fill="#D4AF37"
                        strokeWidth={2}
                      />
                      <span className="text-sm text-white font-poppins">
                        {providerRating.toFixed(1)} ({reviewsCount}{' '}
                        {reviewsCount === 1 ? 'reseña' : 'reseñas'})
                      </span>
                    </div>
                  </div>

                  {/* Mapa placeholder */}
                  <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-linear-to-br from-teal-100 to-teal-200 relative flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin
                          className="w-8 h-8 mx-auto mb-1"
                          style={{ color: '#0F766E' }}
                          strokeWidth={2}
                        />
                        <p className="text-xs text-teal-800 font-semibold font-poppins">
                          BOBO
                        </p>
                      </div>
                    </div>
                    {/* Líneas de mapa decorativas */}
                    <div className="absolute inset-0 opacity-20">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <line
                          x1="0"
                          y1="20"
                          x2="100"
                          y2="20"
                          stroke="#0F766E"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="0"
                          y1="40"
                          x2="100"
                          y2="40"
                          stroke="#0F766E"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="0"
                          y1="60"
                          x2="100"
                          y2="60"
                          stroke="#0F766E"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="0"
                          y1="80"
                          x2="100"
                          y2="80"
                          stroke="#0F766E"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="20"
                          y1="0"
                          x2="20"
                          y2="100"
                          stroke="#0F766E"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="40"
                          y1="0"
                          x2="40"
                          y2="100"
                          stroke="#0F766E"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="60"
                          y1="0"
                          x2="60"
                          y2="100"
                          stroke="#0F766E"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="80"
                          y1="0"
                          x2="80"
                          y2="100"
                          stroke="#0F766E"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción - Desktop */}
              <div className="hidden md:flex gap-3">
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex-1 h-12 rounded-lg bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors disabled:opacity-50"
                    type="button"
                  >
                    {isCancelling ? 'Cancelando...' : 'Cancelar Cita'}
                  </button>
                )}
                {canRebook && (
                  <button
                    onClick={handleRebook}
                    className="flex-1 h-12 rounded-lg font-semibold font-poppins transition-colors"
                    style={{
                      backgroundColor: '#D4AF37',
                      color: '#FFFFFF',
                    }}
                    type="button"
                  >
                    Re-reservar
                  </button>
                )}
                {canReschedule && (
                  <button
                    onClick={handleReschedule}
                    className="flex-1 h-12 rounded-lg font-semibold font-poppins transition-colors"
                    style={{
                      backgroundColor: '#D4AF37',
                      color: '#FFFFFF',
                    }}
                    type="button"
                  >
                    Reprogramar Cita
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="md:hidden px-4 py-6">
          {/* Badge de estado */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white font-poppins">
              {statusLabel}
            </span>
          </div>

          {/* Título del servicio */}
          <h2 className="text-2xl font-bold text-white font-playfair mb-6">
            {serviceName}
          </h2>

          {/* Mapa */}
          <div className="bg-white/5 rounded-xl overflow-hidden mb-6 border border-white/10">
            <div className="w-full h-64 bg-linear-to-br from-teal-100 to-teal-200 relative flex items-center justify-center">
              {/* Placeholder del mapa */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin
                    className="w-12 h-12 mx-auto mb-2"
                    style={{ color: '#0F766E' }}
                    strokeWidth={2}
                  />
                  <p className="text-teal-800 font-semibold font-poppins">
                    BOBO
                  </p>
                </div>
              </div>
              {/* Líneas de mapa decorativas */}
              <div className="absolute inset-0 opacity-20">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="20"
                    x2="100"
                    y2="20"
                    stroke="#0F766E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="40"
                    x2="100"
                    y2="40"
                    stroke="#0F766E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="60"
                    x2="100"
                    y2="60"
                    stroke="#0F766E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="80"
                    x2="100"
                    y2="80"
                    stroke="#0F766E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="20"
                    y1="0"
                    x2="20"
                    y2="100"
                    stroke="#0F766E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="40"
                    y1="0"
                    x2="40"
                    y2="100"
                    stroke="#0F766E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="60"
                    y1="0"
                    x2="60"
                    y2="100"
                    stroke="#0F766E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="80"
                    y1="0"
                    x2="80"
                    y2="100"
                    stroke="#0F766E"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Detalles del salón */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white font-playfair mb-2">
              {providerName}
            </h3>
            {fullAddress && (
              <p className="text-sm text-neutral-300 font-poppins">
                {fullAddress}
              </p>
            )}
          </div>

          {/* Tabla de información */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-6">
            {/* Fecha y Hora */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="text-sm font-medium text-white font-poppins">
                Fecha y Hora
              </span>
              <span className="text-sm text-white font-poppins">
                {formattedDate}
              </span>
            </div>

            {/* Profesional */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="text-sm font-medium text-white font-poppins">
                Profesional
              </span>
              <span className="text-sm text-white font-poppins">
                {employeeName}
              </span>
            </div>

            {/* Duración */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="text-sm font-medium text-white font-poppins">
                Duración
              </span>
              <span className="text-sm text-white font-poppins">
                {formattedDuration}
              </span>
            </div>

            {/* Precio */}
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-sm font-medium text-white font-poppins">
                Precio
              </span>
              <span
                className="text-lg font-bold font-poppins"
                style={{ color: '#D4AF37' }}
              >
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Botones de acción - Mobile */}
          <div className="space-y-3">
            {canRebook && (
              <button
                onClick={handleRebook}
                className="w-full h-12 rounded-xl font-semibold font-poppins transition-colors"
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
                className="w-full h-12 rounded-xl font-semibold font-poppins transition-colors"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#1A1A1A',
                }}
                type="button"
              >
                Reprogramar Cita
              </button>
            )}
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white font-semibold font-poppins hover:bg-white/10 transition-colors disabled:opacity-50"
                type="button"
              >
                {isCancelling ? 'Cancelando...' : 'Cancelar Cita'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
