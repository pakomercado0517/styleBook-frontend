'use client';

import type { ReactNode } from 'react';
import { useProviderStats } from '@/lib/hooks/useProviderStats';
import { useProviderAppointments } from '@/lib/hooks/useAppointments';
import { format, startOfDay, addDays, startOfWeek } from 'date-fns';
import { DashboardHeader } from './components/DashboardHeader';
import { MetricCard } from './components/MetricCard';
import { AppointmentCalendar } from './components/AppointmentCalendar';
import { IncomeTrends } from './components/IncomeTrends';
import { RecentActivity } from './components/RecentActivity';

/**
 * Dashboard Home - Proveedor
 * Vista mobile-first con métricas, calendario, tendencias y actividad reciente
 */
export default function ProviderDashboardPage(): ReactNode {
  const { data: stats } = useProviderStats();

  // Obtener próximas citas (hoy y próximos días)
  const today = new Date();
  const todayStart = format(startOfDay(today), "yyyy-MM-dd'T'00:00:00");
  const nextWeekEnd = format(
    addDays(today, 7),
    "yyyy-MM-dd'T'23:59:59"
  );

  const { data: upcomingAppointmentsResponse } = useProviderAppointments({
    start_date: todayStart,
    end_date: nextWeekEnd,
    limit: 100,
  });

  const upcomingAppointments =
    upcomingAppointmentsResponse?.data?.appointments || [];

  // Formatear ingresos
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calcular ingresos del mes
  const monthlyRevenue = stats?.monthlyRevenue || 0;

  // Calcular nuevas reservas de la semana
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekBookings = upcomingAppointments.filter(
    (apt) => new Date(apt.createdAt) >= weekStart
  ).length;

  // Citas próximas de hoy
  const todayAppointments = upcomingAppointments.filter(
    (apt) =>
      format(new Date(apt.start_date_local), 'yyyy-MM-dd') ===
      format(today, 'yyyy-MM-dd')
  ).length;

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Contenido principal */}
      <div className="flex-1 px-4 py-6 pb-20 md:pb-6 md:px-8 space-y-6">
        {/* Cards de Métricas - Grid 2x2 en mobile, 4 columnas en desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <MetricCard
            title="Citas Próximas Hoy"
            value={todayAppointments || stats?.appointmentsToday || 0}
          />
          <MetricCard
            title="Ingresos del Mes"
            value={formatCurrency(monthlyRevenue)}
          />
          <MetricCard
            title="Calificación Promedio"
            value={
              stats?.averageRating
                ? `${stats.averageRating.toFixed(1)} / 5`
                : '0.0 / 5'
            }
          />
          <MetricCard
            title="Nuevas Reservas (Semana)"
            value={weekBookings}
          />
        </div>

        {/* Layout de dos columnas en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Calendario de Citas */}
            <AppointmentCalendar />
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Tendencias de Ingresos */}
            <IncomeTrends />
          </div>
        </div>

        {/* Actividad Reciente - Ancho completo */}
        <RecentActivity />
      </div>
    </div>
  );
}
