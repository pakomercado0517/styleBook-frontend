'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getServiceById } from '@/lib/api/services';
import { useAppointment } from '@/lib/hooks/useAppointments';
import {
  useUpdateAppointment,
  useCancelAppointment,
  useConfirmAppointment,
  useMarkAppointmentAsNoShow,
} from '@/lib/hooks/useAppointments';
import type { Appointment } from '@/lib/types/appointments';
import type { Service } from '@/lib/types/services';
import { formatLocalDate, formatTime } from '@/lib/utils/dateUtils';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/AlertDialog';

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
 * AppointmentDetails - Vista detallada de una cita para proveedor
 * Muestra toda la información de la cita con acciones disponibles del proveedor
 */
export const AppointmentDetails = ({
  appointmentId,
}: AppointmentDetailsProps): ReactNode => {
  const router = useRouter();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useAppointment(appointmentId);

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
    enabled: !!data?.service_id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const updateAppointment = useUpdateAppointment();
  const cancelAppointment = useCancelAppointment();
  const confirmAppointment = useConfirmAppointment();
  const markNoShow = useMarkAppointmentAsNoShow();

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
            onClick={() => router.push('/provider/appointments')}
          >
            Volver a Gestión de Citas
          </Button>
        </div>
      </div>
    );
  }

  const appointment: Appointment = data;
  const service: Service | null = serviceData || appointment.service || null;
  const status = statusMap[appointment.status];

  // Usar fechas formateadas del backend si están disponibles
  const displayStartDate =
    appointment.formatted_dates?.start ||
    formatLocalDate(appointment.start_date_local);
  const displayEndDate =
    appointment.formatted_dates?.end ||
    formatLocalDate(appointment.end_date_local);
  const displayStartTime = appointment.formatted_dates?.start
    ? appointment.formatted_dates.start.split(' ')[1] || ''
    : formatTime(appointment.start_date_local);
  const displayEndTime = appointment.formatted_dates?.end
    ? appointment.formatted_dates.end.split(' ')[1] || ''
    : formatTime(appointment.end_date_local);

  // Calcular duración
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

  // Información del cliente
  const clientName = appointment.client?.name || `Cliente #${appointment.client_id}`;
  const clientEmail = appointment.client?.email;
  const clientPhone = appointment.client?.phone;

  // Información del empleado
  const employeeName = appointment.employee?.name || `Empleado #${appointment.employee_id}`;
  const employeeEmail = appointment.employee?.email;
  // Nota: employee es de tipo User, no Employee, por lo que no tiene specialty
  // Si necesitas specialty, deberías obtener el Employee por separado
  const employeeSpecialty = undefined;

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

  // Acciones disponibles según el estado
  const canConfirm = appointment.status === 'pending';
  const canComplete = appointment.status === 'confirmed';
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const canMarkNoShow = ['pending', 'confirmed'].includes(appointment.status);

  const handleBack = (): void => {
    router.push('/provider/appointments');
  };

  const handleConfirm = (): void => {
    confirmAppointment.mutate(appointment.id);
  };

  const handleComplete = (): void => {
    updateAppointment.mutate({
      appointmentId: appointment.id,
      data: { status: 'completed' },
    });
  };

  const handleCancel = (): void => {
    cancelAppointment.mutate(appointment.id, {
      onSuccess: () => {
        setIsCancelDialogOpen(false);
      },
    });
  };

  const handleMarkNoShow = (): void => {
    markNoShow.mutate(appointment.id);
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
          aria-label="Volver a gestión de citas"
        >
          <span>←</span>
          <span>Volver a Gestión de Citas</span>
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
                {displayStartDate} a las {displayStartTime}
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
                {displayEndDate} a las {displayEndTime}
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
        {/* Información del Cliente */}
        <Card className="p-6">
          <h3 className="font-playfair text-xl font-bold text-primary-800 mb-4">
            Información del Cliente
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-500 font-poppins mb-1">
                Nombre
              </p>
              <p className="text-primary-800 font-poppins font-semibold text-lg">
                {clientName}
              </p>
            </div>
            {clientEmail && (
              <div>
                <p className="text-sm text-neutral-500 font-poppins mb-1">
                  Email
                </p>
                <p className="text-primary-800 font-poppins">{clientEmail}</p>
              </div>
            )}
            {clientPhone && (
              <div>
                <p className="text-sm text-neutral-500 font-poppins mb-1">
                  Teléfono
                </p>
                <p className="text-primary-800 font-poppins">{clientPhone}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Información del Empleado */}
        <Card className="p-6">
          <h3 className="font-playfair text-xl font-bold text-primary-800 mb-4">
            Información del Empleado
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-500 font-poppins mb-1">
                Nombre
              </p>
              <p className="text-primary-800 font-poppins font-semibold text-lg">
                {employeeName}
              </p>
            </div>
            {employeeSpecialty && (
              <div>
                <p className="text-sm text-neutral-500 font-poppins mb-1">
                  Especialidad
                </p>
                <Badge variant="secondary" className="mt-1">
                  {employeeSpecialty}
                </Badge>
              </div>
            )}
            {employeeEmail && (
              <div>
                <p className="text-sm text-neutral-500 font-poppins mb-1">
                  Email
                </p>
                <p className="text-primary-800 font-poppins">{employeeEmail}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Información del Servicio */}
      <Card className="p-6 mb-6">
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

      {/* Acciones del Proveedor */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {canConfirm && (
          <Button
            variant="gold"
            size="md"
            onClick={handleConfirm}
            disabled={confirmAppointment.isPending}
            className="flex-1 sm:flex-initial"
          >
            {confirmAppointment.isPending ? 'Confirmando...' : '✅ Confirmar Cita'}
          </Button>
        )}

        {canComplete && (
          <Button
            variant="primary"
            size="md"
            onClick={handleComplete}
            disabled={updateAppointment.isPending}
            className="flex-1 sm:flex-initial"
          >
            {updateAppointment.isPending ? 'Completando...' : '✔️ Completar Cita'}
          </Button>
        )}

        {canMarkNoShow && (
          <Button
            variant="secondary"
            size="md"
            onClick={handleMarkNoShow}
            disabled={markNoShow.isPending}
            className="flex-1 sm:flex-initial"
          >
            {markNoShow.isPending ? 'Marcando...' : '🚫 No Asistió'}
          </Button>
        )}

        {canCancel && (
          <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="md"
                className="flex-1 sm:flex-initial border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
              >
                ❌ Cancelar Cita
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cancelar cita?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción cancelará la cita "{serviceName}" del cliente {clientName}.
                  ¿Estás seguro?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsCancelDialogOpen(false)}>
                  No, mantener
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  variant="primary"
                  disabled={cancelAppointment.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white border-red-700 disabled:opacity-50"
                >
                  {cancelAppointment.isPending ? 'Cancelando...' : 'Sí, cancelar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button
          variant="outline"
          size="md"
          onClick={handleBack}
          className="flex-1 sm:flex-initial"
        >
          Volver
        </Button>
      </div>

      {/* Información Técnica (Opcional - Colapsable) */}
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
              <p className="text-neutral-500 font-poppins mb-1">ID de la Cita</p>
              <p className="text-primary-800 font-poppins font-medium">
                #{appointment.id}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 font-poppins mb-1">Timezone</p>
              <p className="text-primary-800 font-poppins font-medium">
                {appointment.timezone || 'N/A'}
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
    </div>
  );
};

