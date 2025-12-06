'use client';

import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProviderAppointments } from '@/lib/api/appointments';
import { ProviderAppointmentCard } from './ProviderAppointmentCard';
import { isToday, isAfter } from 'date-fns';
import type { AppointmentStatus } from '@/lib/types/appointments';

interface ProviderAppointmentsListProps {
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  filterByTab?: 'today' | 'upcoming' | 'pending';
}

/**
 * Lista de citas del proveedor con filtros
 */
export function ProviderAppointmentsList({
  status,
  startDate,
  endDate,
  filterByTab = 'today',
}: ProviderAppointmentsListProps): ReactNode {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['provider-appointments', status, startDate, endDate, filterByTab],
    queryFn: async () => {
      const params: {
        status?: string;
        start_date?: string;
        end_date?: string;
        limit: number;
      } = {
        limit: 100, // Obtener más citas para filtrar en el cliente
      };

      if (status) params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const result = await getProviderAppointments(params);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

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

  // Filtrar según el tab si es necesario
  if (filterByTab === 'upcoming') {
    const today = new Date();
    appointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.start_date_local);
      return isAfter(aptDate, today) && !isToday(aptDate);
    });
  }

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

