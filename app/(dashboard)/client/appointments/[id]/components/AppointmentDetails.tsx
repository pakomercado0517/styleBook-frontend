'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAppointment, cancelAppointment } from '@/lib/api/appointments';
import { getServiceById } from '@/lib/api/services';
import type { Appointment } from '@/lib/types/appointments';
import type { Service } from '@/lib/types/services';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface AppointmentDetailsProps {
  appointmentId: number;
}

const statusMap = {
  pending: { text: 'Pendiente', variant: 'warning' as const, icon: '⏳' },
  confirmed: { text: 'Confirmada', variant: 'success' as const, icon: '✅' },
  completed: { text: 'Completada', variant: 'info' as const, icon: '✔️' },
  cancelled: { text: 'Cancelada', variant: 'error' as const, icon: '❌' },
  no_show: { text: 'No asistió', variant: 'error' as const, icon: '🚫' },
} as const;

/**
 * AppointmentDetails - Vista detallada de una cita
 * Muestra toda la información de la cita con acciones disponibles
 */
export const AppointmentDetails = ({
  appointmentId,
}: AppointmentDetailsProps): ReactNode => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
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

  // Obtener información del servicio
  const {
    data: serviceData,
    isLoading: isLoadingService,
    isError: isErrorService,
  } = useQuery({
    queryKey: ['service', data?.service_id],
    queryFn: async () => {
      if (!data?.service_id) {
        return null;
      }

      const result = await getServiceById(data.service_id);

      if (!result.success) {
        return null;
      }

      return result.data;
    },
    enabled: !!data?.service_id, // Solo ejecutar si hay service_id
    staleTime: 10 * 60 * 1000, // 10 minutos
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

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-neutral-200">
          <div className="mx-auto w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-600 font-poppins">
            Cargando detalles de la cita...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error al cargar la cita';

    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h3 className="font-playfair text-xl font-bold text-red-800 mb-2">
            Error al cargar la cita
          </h3>
          <p className="text-red-600 font-poppins mb-6">{errorMessage}</p>
          <Button
            variant="outline"
            onClick={() => router.push('/client/appointments')}
          >
            Volver a Mis Citas
          </Button>
        </div>
      </div>
    );
  }

  const appointment: Appointment = data;
  const service: Service | null = serviceData || appointment.service || null;
  const status = statusMap[appointment.status];
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const canReschedule = ['pending', 'confirmed'].includes(appointment.status);

  // Usar fechas formateadas del backend si están disponibles
  const displayStartDate =
    appointment.formatted_dates?.start ||
    new Date(appointment.start_date_local).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const displayEndDate =
    appointment.formatted_dates?.end ||
    new Date(appointment.end_date_local).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Calcular duración (usar duración del servicio si está disponible, sino calcular)
  const serviceDuration = service?.duration_minutes || 0;
  const startDate = new Date(appointment.start_date_local);
  const endDate = new Date(appointment.end_date_local);
  const calculatedDuration = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60)
  );
  const durationMinutes =
    serviceDuration > 0 ? serviceDuration : calculatedDuration;

  // Convertir final_price a number si viene como string
  const priceNumber =
    typeof appointment.final_price === 'string'
      ? parseFloat(appointment.final_price)
      : appointment.final_price;

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(priceNumber);

  // Información del servicio
  const serviceName = service?.name || `Servicio #${appointment.service_id}`;
  const serviceDescription = service?.description;
  const serviceCategory = service?.category;
  const servicePrice = service?.price;
  const serviceProvider = service?.provider;

  // Mapeo de categorías a español
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

  const handleBack = (): void => {
    router.push('/client/appointments');
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

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Header con botón volver */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={handleBack}
          className="
            flex items-center gap-2
            text-neutral-600 hover:text-primary-800
            font-poppins text-sm font-medium
            mb-4
            transition-colors duration-200
          "
          type="button"
          aria-label="Volver a mis citas"
        >
          <span>←</span>
          <span>Volver a Mis Citas</span>
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
              Detalles de la Cita
            </h1>
            <p className="text-neutral-600 font-poppins text-base md:text-lg">
              {serviceName}
            </p>
          </div>
          <Badge variant={status.variant} className="shrink-0">
            <span className="mr-1">{status.icon}</span>
            <span>{status.text}</span>
          </Badge>
        </div>
      </div>

      {/* Información Principal */}
      <Card className="p-6 md:p-8 mb-6">
        <div className="space-y-6">
          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📅</span>
                <h3 className="font-poppins font-semibold text-primary-800 text-xl">
                  Fecha y Hora de Inicio
                </h3>
              </div>
              <p className="text-neutral-700 font-poppins text-base">
                {displayStartDate}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🕐</span>
                <h3 className="font-poppins font-semibold text-primary-800 text-xl">
                  Fecha y Hora de Fin
                </h3>
              </div>
              <p className="text-neutral-700 font-poppins text-base">
                {displayEndDate}
              </p>
            </div>
          </div>

          {/* Duración y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⏱️</span>
                <h3 className="font-poppins font-semibold text-primary-800 text-xl">
                  Duración
                </h3>
              </div>
              <p className="text-neutral-700 font-poppins text-base">
                {durationMinutes} minutos
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💰</span>
                <h3 className="font-poppins font-semibold text-primary-800 text-xl">
                  Precio Total
                </h3>
              </div>
              <p className="font-playfair text-xl font-bold text-accent-500">
                {formattedPrice}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Información Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Información del Servicio */}
        <Card className="p-6">
          <h3 className="font-playfair text-xl font-bold text-primary-800 mb-4">
            Información del Servicio
          </h3>
          {isLoadingService ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : service ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 font-poppins mb-1">
                  Nombre del Servicio
                </p>
                <p className="text-primary-800 font-poppins font-semibold text-lg">
                  {service.name}
                </p>
              </div>

              {serviceCategory && (
                <div>
                  <p className="text-sm text-neutral-500 font-poppins mb-1">
                    Categoría
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {categoryLabels[serviceCategory] || serviceCategory}
                  </Badge>
                </div>
              )}

              {serviceDescription && (
                <div>
                  <p className="text-sm text-neutral-500 font-poppins mb-1">
                    Descripción
                  </p>
                  <p className="text-primary-800 font-poppins text-sm leading-relaxed">
                    {serviceDescription}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-200">
                {servicePrice !== undefined && (
                  <div>
                    <p className="text-sm text-neutral-500 font-poppins mb-1">
                      Precio Base
                    </p>
                    <p className="text-primary-800 font-poppins font-semibold">
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }).format(servicePrice)}
                    </p>
                  </div>
                )}
                {durationMinutes > 0 && (
                  <div>
                    <p className="text-sm text-neutral-500 font-poppins mb-1">
                      Duración
                    </p>
                    <p className="text-primary-800 font-poppins font-semibold">
                      {durationMinutes} min
                    </p>
                  </div>
                )}
              </div>

              {serviceProvider && (
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 font-poppins mb-2">
                    Proveedor
                  </p>
                  <div className="space-y-2">
                    <p className="text-primary-800 font-poppins font-semibold">
                      {serviceProvider.business_name}
                    </p>
                    {serviceProvider.city && (
                      <p className="text-sm text-neutral-600 font-poppins">
                        📍 {serviceProvider.city}
                      </p>
                    )}
                    {serviceProvider.address && (
                      <p className="text-sm text-neutral-600 font-poppins">
                        {serviceProvider.address}
                      </p>
                    )}
                    {serviceProvider.average_rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-accent-500">⭐</span>
                        <span className="text-sm font-semibold text-primary-800">
                          {serviceProvider.average_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-neutral-500 font-poppins text-sm">
                {isErrorService
                  ? 'No se pudo cargar la información del servicio'
                  : 'Información del servicio no disponible'}
              </p>
            </div>
          )}
        </Card>

        {/* Información del Profesional */}
        <Card className="p-6">
          <h3 className="font-playfair text-xl font-bold text-primary-800 mb-4">
            Información del Profesional
          </h3>
          <div className="space-y-3">
            {appointment.employee ? (
              <>
                <div>
                  <p className="text-sm text-neutral-500 font-poppins mb-1">
                    Nombre
                  </p>
                  <p className="text-primary-800 font-poppins font-semibold text-lg">
                    {appointment.employee.name}
                  </p>
                </div>
                {appointment.employee.email && (
                  <div>
                    <p className="text-sm text-neutral-500 font-poppins mb-1">
                      Email
                    </p>
                    <p className="text-primary-800 font-poppins">
                      {appointment.employee.email}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-neutral-500 font-poppins text-sm">
                  Información del profesional no disponible
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Notas */}
      {appointment.notes && (
        <Card className="p-6 mb-6">
          <h3 className="font-playfair text-xl font-bold text-primary-800 mb-4">
            Notas
          </h3>
          <p className="text-neutral-700 font-poppins whitespace-pre-wrap">
            {appointment.notes}
          </p>
        </Card>
      )}

      {/* Información Adicional (Opcional - Colapsable) */}
      <details className="mb-6">
        <summary
          className="
          cursor-pointer
          bg-neutral-50 rounded-2xl p-4
          font-poppins font-medium text-primary-800
          hover:bg-neutral-100
          transition-colors duration-200
          list-none
        "
        >
          <span className="flex items-center gap-2">
            <span>ℹ️</span>
            <span>Información Técnica</span>
          </span>
        </summary>
        <Card className="p-6 mt-2 bg-neutral-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500 font-poppins mb-1">
                ID de la Cita
              </p>
              <p className="text-primary-800 font-poppins font-medium">
                #{appointment.id}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 font-poppins mb-1">Timezone</p>
              <p className="text-primary-800 font-poppins font-medium">
                {appointment.timezone}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 font-poppins mb-1">Creada</p>
              <p className="text-primary-800 font-poppins font-medium">
                {new Date(appointment.createdAt).toLocaleString('es-MX')}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 font-poppins mb-1">
                Última Actualización
              </p>
              <p className="text-primary-800 font-poppins font-medium">
                {new Date(appointment.updatedAt).toLocaleString('es-MX')}
              </p>
            </div>
          </div>
        </Card>
      </details>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        {canReschedule && (
          <Button
            variant="secondary"
            size="md"
            onClick={handleReschedule}
            className="flex-1"
            aria={{ label: 'Reagendar cita' }}
          >
            Reagendar Cita
          </Button>
        )}

        {canCancel && (
          <Button
            variant="outline"
            size="md"
            onClick={handleCancel}
            disabled={isCancelling}
            className="flex-1 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
            aria={{ label: 'Cancelar cita' }}
          >
            {isCancelling ? 'Cancelando...' : 'Cancelar Cita'}
          </Button>
        )}

        <Button
          variant="outline"
          size="md"
          onClick={handleBack}
          className="flex-1"
          aria={{ label: 'Volver a mis citas' }}
        >
          Volver
        </Button>
      </div>
    </div>
  );
};
