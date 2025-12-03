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
  const rawPrice = appointment.final_price;
  const priceNumber =
    typeof rawPrice === 'string'
      ? parseFloat(rawPrice)
      : typeof rawPrice === 'number'
        ? rawPrice
        : 0;

  // Validar que el precio sea un número válido
  const isValidPrice =
    !isNaN(priceNumber) && isFinite(priceNumber) && priceNumber >= 0;

  const formattedPrice =
    isValidPrice && priceNumber > 0
      ? new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(priceNumber)
      : isValidPrice && priceNumber === 0
        ? '$0.00'
        : 'Precio no disponible';

  // Información del servicio
  const serviceName =
    appointment.service?.name || `Servicio #${appointment.service_id}`;
  const serviceCategory = appointment.service?.category;
  const serviceDescription = appointment.service?.description;
  const serviceImage = appointment.service?.image_url;
  const hasServiceDetails = appointment.service !== undefined;

  // Información del profesional/empleado
  // Según la documentación actualizada, employee viene como Employee completo
  const employeeName =
    appointment.employee?.name || `Empleado #${appointment.employee_id}`;
  const employeeSpecialty = appointment.employee?.specialty;
  const employeePhoto = appointment.employee?.photo_url;
  const employeeRating = appointment.employee?.rating;

  // Información del proveedor
  // Según la documentación, provider viene directamente en appointment, no anidado en service
  const providerName =
    appointment.provider?.business_name ||
    appointment.service?.provider?.business_name;
  const providerDescription = appointment.provider?.description;
  const providerAddress =
    appointment.provider?.address || appointment.service?.provider?.address;
  const providerCity =
    appointment.provider?.city || appointment.service?.provider?.city;
  const providerCountry = appointment.provider?.country;
  const providerRating = appointment.provider?.average_rating;

  // Categorías en español
  const categoryLabels: Record<string, string> = {
    corte: 'Corte',
    tinte: 'Tinte',
    peinado: 'Peinado',
    manicure: 'Manicure',
    pedicure: 'Pedicure',
    tratamiento_capilar: 'Tratamiento Capilar',
    barba: 'Barba',
    afeitado: 'Afeitado',
    masaje: 'Masaje',
    facial: 'Facial',
    corporal: 'Corporal',
    aromaterapia: 'Aromaterapia',
    limpieza_dental: 'Limpieza Dental',
    estetica_dental: 'Estética Dental',
  };

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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-primary-800 hover:text-accent-500 transition-colors truncate">
                {serviceName}
              </h3>
            </div>
            {serviceCategory && (
              <Badge variant="secondary" className="text-xs">
                {categoryLabels[serviceCategory] || serviceCategory}
              </Badge>
            )}
          </div>
          <Badge variant={status.variant} className="shrink-0">
            <span className="mr-1">{status.icon}</span>
            <span className="hidden sm:inline">{status.text}</span>
          </Badge>
        </div>

        {/* Imagen del servicio si está disponible */}
        {serviceImage && (
          <div className="w-full h-32 rounded-xl overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={serviceImage}
              alt={serviceName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Descripción breve del servicio */}
        {serviceDescription && (
          <p className="text-sm text-neutral-600 font-poppins line-clamp-2">
            {serviceDescription}
          </p>
        )}

        {/* Advertencia si no hay detalles del servicio */}
        {!hasServiceDetails && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-700 font-poppins">
              ⚠️ Información del servicio no disponible
            </p>
          </div>
        )}

        {/* Información del Proveedor */}
        {providerName && (
          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
            <div className="flex items-start gap-2">
              <span className="text-lg">🏢</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500 font-poppins mb-1">
                  Establecimiento
                </p>
                <p className="text-sm font-semibold text-primary-800 font-poppins truncate">
                  {providerName}
                </p>
                {providerDescription && (
                  <p className="text-xs text-neutral-500 font-poppins mt-1 line-clamp-2">
                    {providerDescription}
                  </p>
                )}
                {(providerCity || providerAddress || providerCountry) && (
                  <p className="text-xs text-neutral-500 font-poppins mt-1 truncate">
                    {[providerCity, providerAddress, providerCountry]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {providerRating !== undefined && providerRating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-accent-500 text-xs">⭐</span>
                    <span className="text-xs font-semibold text-primary-800">
                      {providerRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fecha y Hora - Destacado */}
        <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg p-4 border-2 border-accent-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-900 text-lg">📅</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-neutral-600 font-poppins mb-1">
                Fecha y Hora
              </p>
              <p className="text-base font-bold text-primary-800 font-poppins">
                {displayDate}
              </p>
              {displayTime && (
                <p className="text-sm font-semibold text-accent-700 font-poppins">
                  {displayTime}
                </p>
              )}
            </div>
          </div>
          {durationMinutes > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-accent-200">
              <span className="text-sm">⏱️</span>
              <p className="text-xs text-neutral-600 font-poppins">
                Duración aproximada: {durationMinutes} minutos
              </p>
            </div>
          )}
        </div>

        {/* Información del Profesional */}
        <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
          <div className="flex items-center gap-3">
            {employeePhoto ? (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={employeePhoto}
                  alt={employeeName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                <span className="text-accent-700 font-bold text-lg">
                  {employeeName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-500 font-poppins mb-1">
                Profesional
              </p>
              <p className="text-sm font-semibold text-primary-800 font-poppins truncate">
                {employeeName}
              </p>
              {employeeSpecialty && (
                <p className="text-xs text-neutral-500 font-poppins truncate">
                  {employeeSpecialty}
                </p>
              )}
              {employeeRating !== null &&
                employeeRating !== undefined &&
                typeof employeeRating === 'number' &&
                employeeRating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-accent-500 text-xs">⭐</span>
                    <span className="text-xs font-semibold text-primary-800">
                      {employeeRating.toFixed(1)}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Precio - Destacado */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-lg p-4 text-white">
          <p className="text-xs text-neutral-300 font-poppins mb-1">
            Precio Total
          </p>
          <p
            className="font-playfair text-3xl font-bold whitespace-nowrap"
            style={{ color: '#FFD700' }}
          >
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
