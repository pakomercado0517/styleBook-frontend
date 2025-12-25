'use client';

import type { ReactNode } from 'react';
import { useProviderAppointments } from '@/lib/hooks/useAppointments';
import { format, startOfDay, endOfDay, isToday } from 'date-fns';
import { ProviderAppointmentCard } from './ProviderAppointmentCard';

/**
 * Panel derecho con citas de hoy
 * Solo visible en desktop
 */
export function TodayAppointmentsPanel(): ReactNode {
  const today = new Date();
  const todayStart = format(startOfDay(today), "yyyy-MM-dd'T'00:00:00");
  const todayEnd = format(endOfDay(today), "yyyy-MM-dd'T'23:59:59");

  const { data, isLoading } = useProviderAppointments({
    start_date: todayStart,
    end_date: todayEnd,
    limit: 50,
  });

  const appointments = data?.data?.appointments || [];

  // Filtrar solo las de hoy
  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.start_date_local);
    return isToday(aptDate);
  });

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white font-playfair mb-6">
        Citas para Hoy
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 rounded-xl p-4 border border-white/10 animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded mb-3 w-3/4"></div>
              <div className="h-3 bg-white/10 rounded mb-2 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : todayAppointments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-neutral-400 font-poppins text-sm text-center">
            No hay citas para hoy
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {todayAppointments.map((appointment) => (
            <ProviderAppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

