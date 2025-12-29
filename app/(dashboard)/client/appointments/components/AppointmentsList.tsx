'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/lib/api/appointments';
import type { Appointment, AppointmentStatus } from '@/lib/types/appointments';
import { AppointmentCard } from './AppointmentCard';

/**
 * Componente AppointmentsList
 *
 * Estrategia de actualización:
 * 1. `refetchOnWindowFocus: true` - Refetcha cuando el usuario vuelve a la pestaña
 * 2. `refetchOnMount: true` - Refetcha si los datos están "stale" (>1 min sin actualizar)
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
  isPast?: boolean; // Para filtrar citas pasadas (por fecha)
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
  isPast = false,
  searchQuery = '',
  onSelectAppointment,
  selectedAppointmentId,
}: AppointmentsListProps): ReactNode => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 12;

  // Resetear página cuando cambian los filtros principales
  useEffect(() => {
    setCurrentPage(1);
  }, [status, isUpcoming, isPast, searchQuery]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'appointments',
      status,
      startDate,
      endDate,
      currentPage,
      isUpcoming,
      isPast,
      searchQuery,
    ],
    queryFn: async () => {
      // Para "Próximas" y "Pasadas", necesitamos obtener más resultados porque filtramos en el frontend
      // Para otros tabs (cancelled), usamos la paginación del backend normalmente
      const fetchLimit = isUpcoming || isPast ? 100 : limit; // Obtener más resultados para filtrar
      const fetchOffset = isUpcoming || isPast ? 0 : (currentPage - 1) * limit;

      // Construir params según el tipo de filtro
      const params: {
        limit: number;
        offset: number;
        status?: string;
        start_date?: string;
        end_date?: string;
        include?: string;
        past?: number;
      } = {
        limit: fetchLimit,
        offset: fetchOffset,
        include: 'service,employee,provider',
      };

      // Para "Próximas", NO enviar parámetros de fecha al backend
      // Obtendremos todas las citas y las filtraremos en el frontend
      if (isUpcoming) {
        // No enviar parámetros de fecha, obtendremos todas y filtraremos en frontend
        // No filtrar por status aquí, lo haremos en el frontend
        // NO incluir start_date ni end_date
      } else if (isPast) {
        // Para "Pasadas", usar SOLO el parámetro "past" con número de días hacia atrás
        // Buscar citas de los últimos 365 días (1 año)
        params.past = 365;
        // CRÍTICO: NO incluir start_date ni end_date cuando usamos past
        // No filtrar por status aquí, lo haremos en el frontend por fecha
      } else {
        // Para otros tabs (cancelled), usar el status
        if (status) {
          params.status = status;
        }
        // Si hay fechas específicas pasadas como props, usarlas
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
      }

      const result = await getAppointments(params);

      if (!result.success) {
        throw new Error(result.error);
      }

      let appointments = result.data.data.appointments;

      // Filtrar en el frontend para "Próximas" (solo pending y confirmed, y fechas futuras)
      if (isUpcoming) {
        const now = new Date();
        appointments = appointments.filter((apt) => {
          // Verificar que el estado sea pending o confirmed
          const isValidStatus =
            apt.status === 'pending' || apt.status === 'confirmed';
          // Verificar que la fecha de inicio sea futura
          const appointmentStartDate = new Date(apt.start_date_local);
          const isFutureDate = appointmentStartDate >= now;
          return isValidStatus && isFutureDate;
        });
      } else if (isPast) {
        // Para "Pasadas", el backend ya filtra por fecha usando el parámetro "past"
        // Solo necesitamos excluir las citas canceladas en el frontend
        appointments = appointments.filter((apt) => {
          // Excluir citas canceladas de las pasadas
          return apt.status !== 'cancelled';
        });
      } else {
        // Para otros tabs (cancelled), filtrar por status en el frontend
        // Esto asegura que solo se muestren las citas del estado correcto
        // incluso si el backend no filtró correctamente
        if (status) {
          appointments = appointments.filter((apt) => apt.status === status);
        } else {
          // Si no hay status y no es upcoming ni past, no deberíamos tener citas
          appointments = [];
        }
      }

      // Filtrar por búsqueda si hay query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        appointments = appointments.filter((apt) => {
          const serviceName = apt.service?.name?.toLowerCase() || '';
          const providerName = apt.provider?.business_name?.toLowerCase() || '';
          const employeeName = apt.employee?.name?.toLowerCase() || '';
          return (
            serviceName.includes(query) ||
            providerName.includes(query) ||
            employeeName.includes(query)
          );
        });
      }

      // Para "Próximas", "Pasadas" o cuando hay búsqueda, paginar en el frontend
      if (isUpcoming || isPast || searchQuery) {
        const totalFiltered = appointments.length;
        const totalPages = Math.ceil(totalFiltered / limit);
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedAppointments = appointments.slice(startIndex, endIndex);

        return {
          ...result.data,
          data: {
            ...result.data.data,
            appointments: paginatedAppointments,
            pagination: {
              page: currentPage,
              limit: limit,
              total: totalFiltered,
              pages: totalPages,
            },
          },
        };
      }

      // Para otros tabs sin búsqueda, usar la paginación del backend
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
    refetchOnMount: true, // Refetch si los datos están stale (según staleTime)

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
