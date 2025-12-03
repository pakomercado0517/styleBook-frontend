'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/lib/api/appointments';
import type { Appointment, AppointmentStatus } from '@/lib/types/appointments';
import { AppointmentCard } from './AppointmentCard';

interface AppointmentsListProps {
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
}

/**
 * AppointmentsList - Lista de citas con filtros y paginación
 */
export const AppointmentsList = ({
  status,
  startDate,
  endDate,
}: AppointmentsListProps): ReactNode => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 12;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['appointments', status, startDate, endDate, currentPage],
    queryFn: async () => {
      const params: {
        limit: number;
        offset: number;
        status?: string;
        start_date?: string;
        end_date?: string;
        include?: string;
      } = {
        limit,
        offset: (currentPage - 1) * limit,
        include: 'service,employee,provider',
      };

      if (status) params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const result = await getAppointments(params);

      if (!result.success) {
        throw new Error(result.error);
      }
      console.log('result', result);
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-neutral-200">
        <div className="mx-auto w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-600 font-poppins">Cargando citas...</p>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error al cargar las citas';

    if (errorMessage === 'No hay sesión activa') {
      return (
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-neutral-200">
          <p className="text-neutral-600 font-poppins">
            Inicia sesión para ver tus citas
          </p>
        </div>
      );
    }

    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
        <span className="text-4xl mb-4 block">⚠️</span>
        <h3 className="font-playfair text-xl font-bold text-red-800 mb-2">
          Error al cargar citas
        </h3>
        <p className="text-red-600 font-poppins">{errorMessage}</p>
      </div>
    );
  }

  const { appointments, pagination } = data.data;
  const { total, pages } = pagination;
  const hasResults = appointments.length > 0;
  const hasPagination = pages > 1;

  // Empty state
  if (!hasResults) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-neutral-200">
        <span className="text-6xl mb-4 block">📅</span>
        <h3 className="font-playfair text-xl font-bold text-primary-800 mb-2">
          No hay citas
        </h3>
        <p className="text-neutral-600 font-poppins">
          {status
            ? 'No tienes citas con este filtro'
            : 'No tienes citas programadas'}
        </p>
      </div>
    );
  }

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Contador de resultados */}
      <div>
        <p className="text-sm text-neutral-600 font-poppins">
          {total === 1 ? '1 cita encontrada' : `${total} citas encontradas`}
        </p>
      </div>

      {/* Grid de citas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {appointments.map((appointment: Appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>

      {/* Paginación */}
      {hasPagination && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="
              px-4 py-2 rounded-lg
              font-poppins text-sm font-medium
              border-2 border-neutral-200
              bg-white text-primary-800
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:border-accent-500/50
              transition-all duration-200
              min-h-[44px]
            "
            type="button"
            aria-label="Página anterior"
          >
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
              let pageNum: number;
              if (pages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pages - 2) {
                pageNum = pages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`
                    w-10 h-10 rounded-lg
                    font-poppins text-sm font-medium
                    border-2 transition-all duration-200
                    ${
                      isActive
                        ? 'bg-accent-500 text-primary-900 border-accent-600'
                        : 'bg-white text-primary-800 border-neutral-200 hover:border-accent-500/50'
                    }
                  `}
                  type="button"
                  aria-label={`Ir a página ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pages}
            className="
              px-4 py-2 rounded-lg
              font-poppins text-sm font-medium
              border-2 border-neutral-200
              bg-white text-primary-800
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:border-accent-500/50
              transition-all duration-200
              min-h-[44px]
            "
            type="button"
            aria-label="Página siguiente"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
