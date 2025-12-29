import { useQuery } from '@tanstack/react-query';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { useMyProviderProfile } from './useMyProviderProfile';
import { useProviderReviewStats, useProviderReviews } from './useReviews';
import { getProviderAppointments } from '@/lib/api/appointments';

export type TimeFrame = 'today' | 'weekly' | 'monthly' | 'annual' | 'custom';

/**
 * Calcula el rango de fechas según el período seleccionado
 */
export function getDateRangeForTimeFrame(timeFrame: TimeFrame): {
  start_date: string;
  end_date: string;
} {
  const now = new Date();

  switch (timeFrame) {
    case 'today':
      return {
        start_date: format(startOfDay(now), "yyyy-MM-dd'T'00:00:00"),
        end_date: format(endOfDay(now), "yyyy-MM-dd'T'23:59:59"),
      };
    case 'weekly':
      return {
        start_date: format(
          startOfWeek(now, { weekStartsOn: 1 }),
          "yyyy-MM-dd'T'00:00:00"
        ),
        end_date: format(
          endOfWeek(now, { weekStartsOn: 1 }),
          "yyyy-MM-dd'T'23:59:59"
        ),
      };
    case 'monthly':
      return {
        start_date: format(startOfMonth(now), "yyyy-MM-dd'T'00:00:00"),
        end_date: format(endOfMonth(now), "yyyy-MM-dd'T'23:59:59"),
      };
    case 'annual':
      return {
        start_date: format(startOfYear(now), "yyyy-MM-dd'T'00:00:00"),
        end_date: format(endOfYear(now), "yyyy-MM-dd'T'23:59:59"),
      };
    default:
      // Por defecto, usar el mes actual
      return {
        start_date: format(startOfMonth(now), "yyyy-MM-dd'T'00:00:00"),
        end_date: format(endOfMonth(now), "yyyy-MM-dd'T'23:59:59"),
      };
  }
}

/**
 * Hook para obtener datos de analytics del proveedor
 * Combina estadísticas de reviews y datos de citas
 */
export function useProviderAnalytics(timeFrame: TimeFrame = 'monthly') {
  // Obtener el perfil del proveedor
  const { data: providerProfile, isLoading: isLoadingProfile } =
    useMyProviderProfile();

  const providerId = providerProfile?.id;

  // Calcular rango de fechas según el período
  const dateRange = getDateRangeForTimeFrame(timeFrame);

  // Obtener estadísticas de reviews
  const {
    data: reviewStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: errorStats,
  } = useProviderReviewStats(providerId || 0);

  // Obtener reseñas con estadísticas incluidas
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    error: errorReviews,
  } = useProviderReviews(providerId || 0, { limit: 100 });

  // Obtener todas las citas del período (para métricas generales)
  const {
    data: allAppointmentsData,
    isLoading: isLoadingAllAppointments,
    isError: isErrorAllAppointments,
    error: errorAllAppointments,
  } = useQuery({
    queryKey: [
      'provider-appointments-analytics',
      providerId,
      dateRange.start_date,
      dateRange.end_date,
    ],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getProviderAppointments({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        include: 'service,client',
        limit: 100, // Máximo permitido
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Obtener citas completadas del período (para ingresos)
  const {
    data: completedAppointmentsData,
    isLoading: isLoadingCompletedAppointments,
    isError: isErrorCompletedAppointments,
    error: errorCompletedAppointments,
  } = useQuery({
    queryKey: [
      'provider-appointments-completed-analytics',
      providerId,
      dateRange.start_date,
      dateRange.end_date,
    ],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getProviderAppointments({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        status: 'completed',
        include: 'service',
        limit: 100, // Máximo permitido
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Obtener citas de los últimos 365 días (para tasa de retención)
  const { data: pastYearAppointmentsData, isLoading: isLoadingPastYear } =
    useQuery({
      queryKey: ['provider-appointments-past-year', providerId],
      queryFn: async () => {
        if (!providerId) {
          throw new Error('Provider ID no disponible');
        }
        const result = await getProviderAppointments({
          past: 365,
          include: 'client',
          limit: 100, // Máximo permitido
        });
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
      enabled: !!providerId,
      staleTime: 10 * 60 * 1000, // 10 minutos
    });

  const isLoading =
    isLoadingProfile ||
    isLoadingStats ||
    isLoadingReviews ||
    isLoadingAllAppointments ||
    isLoadingCompletedAppointments ||
    isLoadingPastYear;
  const isError =
    isErrorStats ||
    isErrorReviews ||
    isErrorAllAppointments ||
    isErrorCompletedAppointments;
  const error =
    errorStats ||
    errorReviews ||
    errorAllAppointments ||
    errorCompletedAppointments;

  // Calcular métricas de reviews
  const reviews = reviewsData?.reviews || reviewsData?.data || [];
  const reviewsStatistics = reviewsData?.statistics || {
    total: reviewsData?.total || reviewStats?.total_reviews || 0,
    averageRating:
      reviewsData?.provider_average_rating || reviewStats?.average_rating || 0,
  };

  // Obtener citas
  // La estructura es: { data: { appointments: [...], pagination: {...} } }
  const allAppointments = allAppointmentsData?.data?.appointments || [];
  const completedAppointments =
    completedAppointmentsData?.data?.appointments || [];
  const pastYearAppointments =
    pastYearAppointmentsData?.data?.appointments || [];

  // Calcular métricas de citas
  // 1. Total de Citas
  const totalAppointments =
    allAppointmentsData?.data?.pagination?.total || allAppointments.length;

  // 2. Ingresos Netos (sumar final_price de citas completadas)
  const netIncome = completedAppointments.reduce((sum, apt) => {
    const price =
      typeof apt.final_price === 'string'
        ? parseFloat(apt.final_price)
        : apt.final_price;
    return sum + (price || 0);
  }, 0);

  // 3. Clientes Nuevos (client_id únicos en el período)
  const uniqueClients = new Set(allAppointments.map((apt) => apt.client_id));
  const newClients = uniqueClients.size;

  // 4. Servicio Popular (servicio con más citas)
  const serviceCounts = new Map<string, number>();
  allAppointments.forEach((apt) => {
    if (apt.service?.name) {
      const count = serviceCounts.get(apt.service.name) || 0;
      serviceCounts.set(apt.service.name, count + 1);
    }
  });
  const popularService =
    serviceCounts.size > 0
      ? Array.from(serviceCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';

  // 5. Tasa de Retención (clientes con más de 1 cita en últimos 365 días)
  const clientAppointmentCounts = new Map<number, number>();
  pastYearAppointments.forEach((apt) => {
    const count = clientAppointmentCounts.get(apt.client_id) || 0;
    clientAppointmentCounts.set(apt.client_id, count + 1);
  });
  const totalUniqueClients = clientAppointmentCounts.size;
  const clientsWithMultipleAppointments = Array.from(
    clientAppointmentCounts.values()
  ).filter((count) => count > 1).length;
  const retentionRate =
    totalUniqueClients > 0
      ? Math.round((clientsWithMultipleAppointments / totalUniqueClients) * 100)
      : 0;

  // 6. Tendencia de Ingresos (agrupar por día)
  const incomeByDay = new Map<string, number>();
  completedAppointments.forEach((apt) => {
    const date = new Date(apt.start_date_local);
    const dayKey = format(date, 'yyyy-MM-dd');
    const price =
      typeof apt.final_price === 'string'
        ? parseFloat(apt.final_price)
        : apt.final_price;
    const current = incomeByDay.get(dayKey) || 0;
    incomeByDay.set(dayKey, current + (price || 0));
  });

  // Ordenar por fecha y formatear para el gráfico
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const incomeTrendData = Array.from(incomeByDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([dateStr, income]) => {
      const date = new Date(dateStr);
      const dayName = dayNames[date.getDay()];
      return {
        date: dayName,
        income: Math.round(income),
      };
    });

  // 7. Distribución de Servicios (contar por servicio y calcular porcentajes)
  const totalServiceAppointments = allAppointments.filter(
    (apt) => apt.service?.name
  ).length;
  const serviceDistributionMap = new Map<string, number>();
  allAppointments.forEach((apt) => {
    if (apt.service?.name) {
      const count = serviceDistributionMap.get(apt.service.name) || 0;
      serviceDistributionMap.set(apt.service.name, count + 1);
    }
  });

  // Ordenar por cantidad y tomar top 5, el resto como "Otros"
  const sortedServices = Array.from(serviceDistributionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const otherCount =
    totalServiceAppointments -
    sortedServices.reduce((sum, [, count]) => sum + count, 0);

  const serviceDistributionData = [
    ...sortedServices.map(([service, count]) => ({
      service,
      percentage:
        totalServiceAppointments > 0
          ? Math.round((count / totalServiceAppointments) * 100)
          : 0,
    })),
    ...(otherCount > 0
      ? [
          {
            service: 'Otros',
            percentage:
              totalServiceAppointments > 0
                ? Math.round((otherCount / totalServiceAppointments) * 100)
                : 0,
          },
        ]
      : []),
  ];

  const metrics = {
    // Estadísticas de reviews
    averageRating:
      reviewStats?.average_rating || reviewsStatistics.averageRating || 0,
    totalReviews: reviewStats?.total_reviews || reviewsStatistics.total || 0,
    ratingDistribution: reviewStats?.rating_distribution || {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0,
    },
    // Métricas de citas
    totalAppointments,
    netIncome,
    newClients,
    popularService,
    retentionRate,
    // Datos para gráficos
    incomeTrendData,
    serviceDistributionData,
    // Datos de reseñas
    reviews,
    reviewsStatistics,
  };

  return {
    providerId,
    providerProfile,
    reviewStats,
    reviewsData,
    metrics,
    isLoading,
    isError,
    error,
  };
}
