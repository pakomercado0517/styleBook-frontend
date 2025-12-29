'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { X, Clock, User, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAppointment } from '@/lib/api/appointments';
import type { Appointment } from '@/lib/types/appointments';

interface ProviderAppointmentDetailsSidebarProps {
  appointmentId: number;
  onClose: () => void;
}

const statusLabels: Record<string, { text: string; color: string }> = {
  pending: { text: 'Pendiente', color: 'text-yellow-400' },
  confirmed: { text: 'Confirmada', color: 'text-green-400' },
  completed: { text: 'Completada', color: 'text-blue-400' },
  cancelled: { text: 'Cancelada', color: 'text-red-400' },
  no_show: { text: 'No asistió', color: 'text-red-400' },
};

/**
 * ProviderAppointmentDetailsSidebar - Sidebar con detalles de la cita seleccionada
 * Versión desktop del sidebar de detalles para proveedor
 */
export const ProviderAppointmentDetailsSidebar = ({
  appointmentId,
  onClose,
}: ProviderAppointmentDetailsSidebarProps): ReactNode => {
  const router = useRouter();

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

  const apt: Appointment = appointment;

  // Información del cliente
  const clientFullName = apt.client
    ? `${apt.client.name}${apt.client.apellido ? ` ${apt.client.apellido}` : ''}`
    : `Cliente #${apt.client_id}`;
  const clientEmail = apt.client?.email;
  const clientPhone = apt.client?.phone;
  const clientAvatar = apt.client?.avatar_url;

  // Información del servicio
  const serviceName = apt.service?.name || `Servicio #${apt.service_id}`;

  // Información del empleado
  const employeeName = apt.employee?.name || `Empleado #${apt.employee_id}`;

  // Formatear fecha y hora
  const appointmentDate = new Date(apt.start_date_local);
  const formattedDate = format(appointmentDate, "EEEE, d 'de' MMMM", {
    locale: es,
  });
  const formattedTime = format(appointmentDate, 'HH:mm', { locale: es });
  const endDate = new Date(apt.end_date_local);
  const formattedEndTime = format(endDate, 'HH:mm', { locale: es });

  // Estado
  const status = statusLabels[apt.status] || {
    text: apt.status,
    color: 'text-neutral-400',
  };

  // Calcular duración
  const durationMinutes = Math.round(
    (endDate.getTime() - appointmentDate.getTime()) / (1000 * 60)
  );

  // Precio
  const priceNumber =
    typeof apt.final_price === 'string'
      ? parseFloat(apt.final_price)
      : apt.final_price;
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(priceNumber);

  const handleViewFullDetails = (): void => {
    router.push(`/provider/appointments/${appointmentId}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header del sidebar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#121212] z-10">
        <h2 className="text-xl font-bold text-white font-playfair">
          Detalles de la Cita
        </h2>
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
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Estado */}
        <div>
          <p className="text-sm font-semibold text-neutral-400 font-poppins mb-2">
            Estado
          </p>
          <p className={`text-base font-semibold font-poppins ${status.color}`}>
            {status.text}
          </p>
        </div>

        {/* Información del Cliente */}
        <div>
          <p className="text-sm font-semibold text-neutral-400 font-poppins mb-3">
            Cliente
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {clientAvatar ? (
                <Image
                  src={clientAvatar}
                  alt={clientFullName}
                  width={32}
                  height={32}
                  className="rounded-full object-cover shrink-0"
                />
              ) : (
                <User
                  className="w-4 h-4"
                  strokeWidth={2}
                  style={{ color: '#D4AF37' }}
                />
              )}
              <p className="text-base font-bold text-white font-poppins">
                {clientFullName}
              </p>
            </div>
            {clientEmail && (
              <div className="flex items-center gap-2 pl-6">
                <Mail
                  className="w-4 h-4"
                  strokeWidth={2}
                  style={{ color: '#D4AF37' }}
                />
                <p className="text-sm text-neutral-300 font-poppins">
                  {clientEmail}
                </p>
              </div>
            )}
            {clientPhone && (
              <div className="flex items-center gap-2 pl-6">
                <Phone
                  className="w-4 h-4"
                  strokeWidth={2}
                  style={{ color: '#D4AF37' }}
                />
                <p className="text-sm text-neutral-300 font-poppins">
                  {clientPhone}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Servicio */}
        <div>
          <p className="text-sm font-semibold text-neutral-400 font-poppins mb-2">
            Servicio
          </p>
          <p className="text-base font-semibold text-white font-poppins">
            {serviceName}
          </p>
        </div>

        {/* Empleado */}
        <div>
          <p className="text-sm font-semibold text-neutral-400 font-poppins mb-2">
            Empleado
          </p>
          <p className="text-base text-white font-poppins">{employeeName}</p>
        </div>

        {/* Fecha y Hora */}
        <div>
          <p className="text-sm font-semibold text-neutral-400 font-poppins mb-2">
            Fecha y Hora
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar
                className="w-4 h-4"
                strokeWidth={2}
                style={{ color: '#D4AF37' }}
              />
              <p className="text-base text-white font-poppins">
                {formattedDate}
              </p>
            </div>
            <div className="flex items-center gap-2 pl-6">
              <Clock
                className="w-4 h-4"
                strokeWidth={2}
                style={{ color: '#D4AF37' }}
              />
              <p className="text-sm text-neutral-300 font-poppins">
                {formattedTime} - {formattedEndTime} ({durationMinutes} min)
              </p>
            </div>
          </div>
        </div>

        {/* Precio */}
        <div>
          <p className="text-sm font-semibold text-neutral-400 font-poppins mb-2">
            Precio
          </p>
          <p
            className="text-lg font-bold font-playfair"
            style={{ color: '#D4AF37' }}
          >
            {formattedPrice}
          </p>
        </div>

        {/* Notas */}
        {apt.notes && (
          <div>
            <p className="text-sm font-semibold text-neutral-400 font-poppins mb-2">
              Notas
            </p>
            <p className="text-sm text-neutral-300 font-poppins whitespace-pre-wrap">
              {apt.notes}
            </p>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="px-6 py-4 border-t border-white/10 space-y-3 sticky bottom-0 bg-[#121212]">
        <button
          onClick={handleViewFullDetails}
          className="w-full h-12 rounded-lg font-semibold font-poppins transition-colors"
          style={{
            backgroundColor: '#D4AF37',
            color: '#1A1A1A',
          }}
          type="button"
        >
          Ver Detalles Completos
        </button>
      </div>
    </div>
  );
};
