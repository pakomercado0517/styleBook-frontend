'use client';

import type { ReactNode } from 'react';
import { Clock } from 'lucide-react';
import type { Appointment } from '@/lib/types/appointments';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UpcomingAppointmentsListProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

/**
 * Lista de próximas citas del proveedor
 * Muestra las próximas 3 citas con información del cliente y servicio
 */
export function UpcomingAppointmentsList({
  appointments,
  isLoading = false,
}: UpcomingAppointmentsListProps): ReactNode {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-playfair">
          Próximas Citas
        </h2>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl p-4 border border-white/10 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded mb-2 w-32"></div>
                <div className="h-3 bg-white/10 rounded w-24"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-playfair">
          Próximas Citas
        </h2>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
          <p className="text-neutral-300 font-poppins text-sm">
            No hay citas próximas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white font-playfair">
        Próximas Citas
      </h2>
      <div className="space-y-3">
        {appointments.slice(0, 3).map((appointment) => {
          const appointmentDate = new Date(appointment.start_date_local);
          const formattedTime = format(appointmentDate, 'hh:mm a', {
            locale: es,
          });
          const clientName =
            appointment.client?.name || `Cliente #${appointment.client_id}`;
          const serviceName =
            appointment.service?.name || `Servicio #${appointment.service_id}`;
          const clientInitial = clientName.charAt(0).toUpperCase();

          return (
            <div
              key={appointment.id}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-4">
                {/* Avatar del cliente */}
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {clientInitial}
                  </span>
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white font-poppins mb-1 truncate">
                    {clientName}
                  </h3>
                  <p className="text-sm text-neutral-300 font-poppins truncate">
                    {serviceName}
                  </p>
                </div>

                {/* Hora */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-4 h-4 text-accent-500" strokeWidth={2} />
                  <span className="text-sm text-white font-poppins whitespace-nowrap">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

