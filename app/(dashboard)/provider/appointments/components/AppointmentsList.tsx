'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProviderAppointments } from '@/lib/api/appointments';
import { AppointmentCard } from './AppointmentCard';
import { Button } from '@/components/Button';
import type { AppointmentStatus } from '@/lib/types/appointments';

interface AppointmentsListProps {
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  employeeId?: number;
}

/**
 * Lista de citas del proveedor con paginación
 */
export function AppointmentsList({
  status,
  startDate,
  endDate,
  employeeId,
}: AppointmentsListProps): ReactNode {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'provider-appointments',
      status,
      startDate,
      endDate,
      employeeId,
      currentPage,
    ],
    queryFn: async () => {
      const params: {
        status?: string;
        start_date?: string;
        end_date?: string;
        employee_id?: number;
        limit: number;
        offset: number;
      } = {
        limit,
        offset,
      };

      if (status) params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (employeeId) params.employee_id = employeeId;

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
      <div className="bg-white rounded-2xl p-8 md:p-12 text-center border-2 border-neutral-200">
        <div className="mx-auto w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-600 font-poppins">Cargando citas...</p>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 text-center border-2 border-red-200">
        <p className="text-red-600 font-poppins">
          {error?.message || 'Error al cargar las citas'}
        </p>
      </div>
    );
  }

  const appointments = data?.data?.appointments || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.pages || 0;

  // Empty state
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 text-center border-2 border-neutral-200">
        <p className="text-neutral-600 font-poppins text-lg mb-2">
          No hay citas disponibles
        </p>
        <p className="text-neutral-500 font-poppins">
          {status || startDate || endDate
            ? 'Intenta ajustar los filtros'
            : 'Aún no tienes citas registradas'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Lista de citas */}
      <div className="space-y-4 mb-6">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Anterior
          </Button>
          <span className="text-neutral-600 font-poppins px-4">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </Button>
        </div>
      )}
    </div>
  );
}

