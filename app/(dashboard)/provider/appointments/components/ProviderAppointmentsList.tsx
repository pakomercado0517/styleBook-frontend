'use client';

import type { ReactNode } from 'react';
import { useProviderAppointments, useProviderPendingAppointments } from '@/lib/hooks/useAppointments';
import { ProviderAppointmentCard } from './ProviderAppointmentCard';
import { isToday, isAfter, startOfDay } from 'date-fns';
import type { AppointmentStatus } from '@/lib/types/appointments';

interface ProviderAppointmentsListProps {
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  filterByTab?: 'today' | 'upcoming' | 'pending';
}

/**
 * Lista de citas del proveedor con filtros
 * Usa hooks optimizados para cada tipo de consulta
 */
export function ProviderAppointmentsList({
  status,
  startDate,
  endDate,
  filterByTab = 'today',
}: ProviderAppointmentsListProps): ReactNode {
  // Para el tab "pending", usar el endpoint específico
  const { data: pendingData, isLoading: isLoadingPending, isError: isErrorPending, error: errorPending } = useProviderPendingAppointments(
    filterByTab === 'pending' ? { limit: 100 } : undefined
  );

  // Para otros tabs, usar el endpoint general
  const { data: allData, isLoading: isLoadingAll, isError: isErrorAll, error: errorAll } = useProviderAppointments(
    filterByTab !== 'pending'
      ? {
          status: status,
          start_date: startDate,
          end_date: endDate,
          limit: 100,
        }
      : undefined // No ejecutar si es pending
  );

  // Determinar qué datos usar según el tab
  const isLoading = filterByTab === 'pending' ? isLoadingPending : isLoadingAll;
  const isError = filterByTab === 'pending' ? isErrorPending : isErrorAll;
  const error = filterByTab === 'pending' ? errorPending : errorAll;
  const data = filterByTab === 'pending' ? pendingData : allData;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl p-4 border border-white/10 animate-pulse"
          >
            <div className="h-4 bg-white/10 rounded mb-3 w-3/4"></div>
            <div className="h-3 bg-white/10 rounded mb-2 w-1/2"></div>
            <div className="h-3 bg-white/10 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
        <p className="text-red-400 font-poppins text-sm">
          {error?.message || 'Error al cargar las citas'}
        </p>
      </div>
    );
  }

  let appointments = data?.data?.appointments || [];

  // Filtrar según el tab activo
  const today = new Date();
  const todayStart = startOfDay(today);

  if (filterByTab === 'today') {
    // Solo mostrar citas de hoy
    appointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.start_date_local);
      return isToday(aptDate);
    });
  } else if (filterByTab === 'upcoming') {
    // Mostrar citas futuras (desde mañana en adelante)
    appointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.start_date_local);
      const aptDateStart = startOfDay(aptDate);
      // Incluir solo las que son después de hoy (mañana en adelante)
      return isAfter(aptDateStart, todayStart);
    });
  }
  // Para "pending" no necesitamos filtrar, el endpoint ya retorna solo pendientes

  // Empty state
  if (appointments.length === 0) {
    return (
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
        <p className="text-neutral-300 font-poppins text-sm">
          No hay citas disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <ProviderAppointmentCard
          key={appointment.id}
          appointment={appointment}
        />
      ))}
    </div>
  );
}

