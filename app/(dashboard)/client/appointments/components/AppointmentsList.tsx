'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/lib/api/appointments';
import type { Appointment, AppointmentStatus } from '@/lib/types/appointments';
import { AppointmentCard } from './AppointmentCard';

/**
 * Componente AppointmentsList
 *
 * Estrategia de actualización:
 * 1. `refetchOnWindowFocus: true` - Refetcha cuando el usuario vuelve a la pestaña
 * 2. `refetchOnMount: 'stale'` - Refetcha si los datos están "stale" (>1 min sin actualizar)
 * 3. `staleTime: 1 * 60 * 1000` - Los datos se marcan como "stale" después de 1 minuto
 *
 * Esto soluciona el problema donde al crear una cita en otra ruta, la lista no se actualizaba.
 * Ahora al volver a la página, se refetcha automáticamente.
 */

interface AppointmentsListProps {
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  isUpcoming?: boolean; // Para filtrar citas futuras (pending y confirmed)
  searchQuery?: string;
  onSelectAppointment?: (id: number) => void;
  selectedAppointmentId?: number | null;
}

/**
 * AppointmentsList - Lista de citas con filtros y paginación
 */
export const AppointmentsList = ({
  status,
  startDate,
  endDate,
  isUpcoming = false,
  searchQuery = '',
  onSelectAppointment,
  selectedAppointmentId,
}: AppointmentsListProps): ReactNode => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 12;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'appointments',
      status,
      startDate,
      endDate,
      currentPage,
      isUpcoming,
      searchQuery,
    ],
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

      // Para "Próximas", filtrar por fechas futuras
      if (isUpcoming) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        params.start_date = today.toISOString().split('T')[0] || '';
        // No filtrar por status, mostrar pending y confirmed
      } else if (status) {
        params.status = status;
      }

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const result = await getAppointments(params);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Filtrar en el frontend para "Próximas" (solo pending y confirmed)
      let appointments = result.data.data.appointments;
      if (isUpcoming) {
        appointments = appointments.filter(
          (apt) => apt.status === 'pending' || apt.status === 'confirmed'
        );
      }

      // Filtrar por búsqueda si hay query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        appointments = appointments.filter((apt) => {
          const serviceName = apt.service?.name?.toLowerCase() || '';
          const providerName = apt.provider?.business_name?.toLowerCase() || '';
          return serviceName.includes(query) || providerName.includes(query);
        });
      }

      return {
        ...result.data,
        data: {
          ...result.data.data,
          appointments,
        },
      };
    },
    // OPCIÓN 1: Refetch automático cuando el usuario vuelve a la página
    // Estrategia de actualización agresiva para sincronizar datos nuevos
    refetchOnWindowFocus: true,
    refetchOnMount: 'stale',

    // OPCIÓN 2: Reducir el tiempo de "staleness" (stale = cuando los datos necesitan actualización)
    // Después de 1 minuto, los datos se marcan como stale y se refetchan
    staleTime: 1 * 60 * 1000, // 1 minuto (antes era 5 minutos)
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-300 font-poppins">Cargando citas...</p>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error al cargar las citas';

    if (errorMessage === 'No hay sesión activa') {
      return (
        <div className="text-center py-12">
          <p className="text-neutral-300 font-poppins">
            Inicia sesión para ver tus citas
          </p>
        </div>
      );
    }

    return (
      <div className="bg-red-50/10 border-2 border-red-500/30 rounded-xl p-6 text-center">
        <span className="text-4xl mb-4 block">⚠️</span>
        <h3 className="font-playfair text-xl font-bold text-red-400 mb-2">
          Error al cargar citas
        </h3>
        <p className="text-red-300 font-poppins">{errorMessage}</p>
      </div>
    );
  }

  const { appointments, pagination } = data.data;
  const { pages } = pagination;
  const hasResults = appointments.length > 0;
  const hasPagination = pages > 1;

  // Empty state
  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">📅</span>
        <h3 className="font-playfair text-xl font-bold text-white mb-2">
          No hay citas
        </h3>
        <p className="text-neutral-300 font-poppins">
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
    <div className="space-y-4">
      {/* Lista de citas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((appointment: Appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onSelect={onSelectAppointment}
            isSelected={selectedAppointmentId === appointment.id}
          />
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
