import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { getProviderRatingStats } from '@/lib/api/stats';
import { getProviderAppointments } from '@/lib/api/appointments';
import { getProviders } from '@/lib/api/providers';
import type { ProviderStats } from '@/lib/types/stats';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';

/**
 * Hook para obtener estadísticas del proveedor para el dashboard
 */
export function useProviderStats() {
  const { user } = useAuth();

  // Obtener el perfil del proveedor del usuario autenticado
  const { data: providerProfile } = useQuery({
    queryKey: ['provider-profile', user?.id],
    queryFn: async () => {
      if (!user || user.role !== 'provider') {
        return null;
      }
      // Buscar el proveedor por user_id
      const result = await getProviders({ limit: 1000 });
      if (!result.success) {
        throw new Error(result.error);
      }
      // Encontrar el proveedor que corresponde al usuario autenticado
      const provider = result.data?.data?.data?.find(
        (p) => p.user_id === user.id
      );
      return provider || null;
    },
    enabled: !!user && user.role === 'provider',
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const providerId = providerProfile?.id;

  // Obtener rating promedio
  const { data: ratingStats, isLoading: isLoadingRating } = useQuery({
    queryKey: ['provider-rating-stats', providerId],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getProviderRatingStats(providerId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Obtener citas de hoy
  const today = new Date();
  const todayStart = format(startOfDay(today), "yyyy-MM-dd'T'00:00:00");
  const todayEnd = format(endOfDay(today), "yyyy-MM-dd'T'23:59:59");

  const { data: todayAppointments, isLoading: isLoadingToday } = useQuery<import('@/lib/types/appointments').AppointmentsPaginatedResponse>({
    queryKey: ['provider-appointments-today', providerId, todayStart, todayEnd],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getProviderAppointments({
        start_date: todayStart,
        end_date: todayEnd,
        limit: 100, // Máximo permitido por el backend
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente porque cambia durante el día)
  });

  // Obtener citas del mes actual (completadas para ingresos)
  const monthStart = format(startOfMonth(today), "yyyy-MM-dd'T'00:00:00");
  const monthEnd = format(endOfMonth(today), "yyyy-MM-dd'T'23:59:59");

  const { data: monthlyAppointments, isLoading: isLoadingMonthly } = useQuery<import('@/lib/types/appointments').AppointmentsPaginatedResponse>({
    queryKey: ['provider-appointments-monthly', providerId, monthStart, monthEnd],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getProviderAppointments({
        status: 'completed',
        start_date: monthStart,
        end_date: monthEnd,
        limit: 100, // Máximo permitido por el backend
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Obtener citas del mes anterior para comparar ingresos
  const lastMonthStart = format(startOfMonth(subMonths(today, 1)), "yyyy-MM-dd'T'00:00:00");
  const lastMonthEnd = format(endOfMonth(subMonths(today, 1)), "yyyy-MM-dd'T'23:59:59");

  const { data: lastMonthAppointments } = useQuery<import('@/lib/types/appointments').AppointmentsPaginatedResponse>({
    queryKey: ['provider-appointments-last-month', providerId, lastMonthStart, lastMonthEnd],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getProviderAppointments({
        status: 'completed',
        start_date: lastMonthStart,
        end_date: lastMonthEnd,
        limit: 100, // Máximo permitido por el backend
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Obtener citas de ayer para comparar citas de hoy
  const yesterdayStart = format(startOfDay(subDays(today, 1)), "yyyy-MM-dd'T'00:00:00");
  const yesterdayEnd = format(endOfDay(subDays(today, 1)), "yyyy-MM-dd'T'23:59:59");

  const { data: yesterdayAppointments } = useQuery<import('@/lib/types/appointments').AppointmentsPaginatedResponse>({
    queryKey: ['provider-appointments-yesterday', providerId, yesterdayStart, yesterdayEnd],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getProviderAppointments({
        start_date: yesterdayStart,
        end_date: yesterdayEnd,
        limit: 100, // Máximo permitido por el backend
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Obtener todas las citas del último mes para clientes activos
  const lastMonthForClientsStart = format(startOfMonth(subMonths(today, 1)), "yyyy-MM-dd'T'00:00:00");
  const lastMonthForClientsEnd = format(endOfDay(today), "yyyy-MM-dd'T'23:59:59");

  const { data: lastMonthAllAppointments, isLoading: isLoadingClients } = useQuery<import('@/lib/types/appointments').AppointmentsPaginatedResponse>({
    queryKey: ['provider-appointments-last-month-clients', providerId, lastMonthForClientsStart, lastMonthForClientsEnd],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getProviderAppointments({
        start_date: lastMonthForClientsStart,
        end_date: lastMonthForClientsEnd,
        limit: 100, // Máximo permitido por el backend
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Calcular estadísticas
  const isLoading = isLoadingRating || isLoadingToday || isLoadingMonthly || isLoadingClients;

  const stats: ProviderStats | undefined = !isLoading && providerId
    ? {
        // Citas de hoy
        appointmentsToday: todayAppointments?.data.appointments?.length || 0,
        appointmentsTodayTrend: yesterdayAppointments?.data.appointments
          ? {
              value: Math.abs(
                (todayAppointments?.data.appointments?.length || 0) -
                  (yesterdayAppointments.data.appointments.length || 0)
              ),
              isPositive:
                (todayAppointments?.data.appointments?.length || 0) >=
                (yesterdayAppointments.data.appointments.length || 0),
            }
          : undefined,

        // Ingresos del mes (suma de final_price de citas completadas)
        monthlyRevenue:
          monthlyAppointments?.data.appointments?.reduce(
            (sum: number, appointment: import('@/lib/types/appointments').Appointment) =>
              sum +
              (typeof appointment.final_price === 'string'
                ? parseFloat(appointment.final_price)
                : appointment.final_price || 0),
            0
          ) || 0,
        monthlyRevenueTrend: lastMonthAppointments?.data.appointments
          ? (() => {
              const currentRevenue =
                monthlyAppointments?.data.appointments?.reduce(
                  (sum: number, appointment: import('@/lib/types/appointments').Appointment) =>
                    sum +
                    (typeof appointment.final_price === 'string'
                      ? parseFloat(appointment.final_price)
                      : appointment.final_price || 0),
                  0
                ) || 0;
              const lastRevenue =
                lastMonthAppointments.data.appointments.reduce(
                  (sum: number, appointment: import('@/lib/types/appointments').Appointment) =>
                    sum +
                    (typeof appointment.final_price === 'string'
                      ? parseFloat(appointment.final_price)
                      : appointment.final_price || 0),
                  0
                ) || 0;
              const difference = currentRevenue - lastRevenue;
              const percentage =
                lastRevenue > 0 ? Math.round((difference / lastRevenue) * 100) : 0;
              return {
                value: Math.abs(percentage),
                isPositive: difference >= 0,
              };
            })()
          : undefined,

        // Rating promedio
        averageRating: ratingStats?.average_rating || 0,

        // Clientes activos (únicos del último mes)
        activeClients:
          lastMonthAllAppointments?.data.appointments
            ? new Set(
                lastMonthAllAppointments.data.appointments
                  .map((appointment: import('@/lib/types/appointments').Appointment) => appointment.client_id)
                  .filter((id): id is number => id !== undefined)
              ).size
            : 0,
      }
    : undefined;

  return {
    data: stats,
    isLoading,
    error: null,
  };
}

