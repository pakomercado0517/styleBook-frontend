'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatLocalDate, formatTime } from '@/lib/utils/dateUtils';
import { useUpdateAppointment, useCancelAppointment } from '@/lib/hooks/useAppointments';
import type { Appointment } from '@/lib/types/appointments';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/AlertDialog';

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
 * AppointmentCard para proveedor
 * Muestra información de la cita y permite acciones: confirmar, completar, cancelar, marcar no_show
 */
export function AppointmentCard({
  appointment,
}: AppointmentCardProps): ReactNode {
  const router = useRouter();
  const updateAppointment = useUpdateAppointment();
  const cancelAppointment = useCancelAppointment();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Usar fechas formateadas del backend si están disponibles
  const displayDate =
    appointment.formatted_dates?.start ||
    formatLocalDate(appointment.start_date_local);
  const displayTime = appointment.formatted_dates?.start
    ? appointment.formatted_dates.start.split(' ')[1] || ''
    : formatTime(appointment.start_date_local);

  // Calcular duración
  const startDate = new Date(appointment.start_date_local);
  const endDate = new Date(appointment.end_date_local);
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60)
  );

  const status = statusMap[appointment.status];

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
  const serviceName =
    appointment.service?.name || `Servicio #${appointment.service_id}`;
  const serviceCategory = appointment.service?.category || '';

  // Información del cliente (no viene en la relación, solo el ID)
  const clientName = `Cliente #${appointment.client_id}`;

  // Información del empleado
  const employeeName =
    appointment.employee?.name || `Empleado #${appointment.employee_id}`;

  // Acciones disponibles según el estado
  const canConfirm = appointment.status === 'pending';
  const canComplete = appointment.status === 'confirmed';
  const canCancel = ['pending', 'confirmed'].includes(appointment.status);
  const canMarkNoShow = ['pending', 'confirmed'].includes(appointment.status);

  const handleConfirm = (): void => {
    updateAppointment.mutate({
      appointmentId: appointment.id,
      data: { status: 'confirmed' },
    });
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
    updateAppointment.mutate({
      appointmentId: appointment.id,
      data: { status: 'no_show' },
    });
  };

  const handleViewDetails = (): void => {
    router.push(`/provider/appointments/${appointment.id}`);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6 hover:border-accent-500/30 hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-300">
      {/* Header con estado */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-playfair text-xl font-bold text-primary-800 mb-1">
            {serviceName}
          </h3>
          {serviceCategory && (
            <p className="text-sm text-neutral-500 font-poppins capitalize">
              {serviceCategory.replace('_', ' ')}
            </p>
          )}
        </div>
        <Badge variant={status.variant} className="ml-2">
          <span className="mr-1">{status.icon}</span>
          {status.text}
        </Badge>
      </div>

      {/* Información de la cita */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-semibold">📅 Fecha:</span>
          <span>{displayDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-semibold">🕐 Hora:</span>
          <span>{displayTime}</span>
          <span className="text-neutral-400">({durationMinutes} min)</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-semibold">👤 Cliente:</span>
          <span>{clientName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-semibold">💼 Empleado:</span>
          <span>{employeeName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="font-semibold">💰 Precio:</span>
          <span className="font-bold text-accent-600">{formattedPrice}</span>
        </div>
        {appointment.notes && (
          <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold">Notas:</span> {appointment.notes}
            </p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200">
        <Button
          variant="outline"
          size="md"
          onClick={handleViewDetails}
          className="flex-1 sm:flex-initial"
        >
          👁️ Ver Detalles
        </Button>

        {canConfirm && (
          <Button
            variant="gold"
            size="md"
            onClick={handleConfirm}
            disabled={updateAppointment.isPending}
            className="flex-1 sm:flex-initial"
          >
            ✅ Confirmar
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
            ✔️ Completar
          </Button>
        )}

        {canMarkNoShow && (
          <Button
            variant="secondary"
            size="md"
            onClick={handleMarkNoShow}
            disabled={updateAppointment.isPending}
            className="flex-1 sm:flex-initial"
          >
            🚫 No asistió
          </Button>
        )}

        {canCancel && (
          <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="md">
                ❌ Cancelar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cancelar cita?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción cancelará la cita &quot;{serviceName}&quot; del cliente {clientName}.
                  ¿Estás seguro?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsCancelDialogOpen(false)}>
                  No, mantener
                </AlertDialogCancel>
                <Button
                  variant="primary"
                  onClick={handleCancel}
                  disabled={cancelAppointment.isPending}
                >
                  {cancelAppointment.isPending ? 'Cancelando...' : 'Sí, cancelar'}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

