'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProviderStats } from '@/lib/hooks/useProviderStats';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';

/**
 * Dashboard Home - Proveedor
 * Muestra estadísticas de negocio y accesos rápidos a gestión
 */
export default function ProviderDashboardPage(): ReactNode {
  const { user } = useAuth();
  const { data: stats, isLoading } = useProviderStats();

  // Formatear ingresos del mes
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formatear rating
  const formatRating = (rating: number): string => {
    return rating > 0 ? rating.toFixed(1) : '0.0';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
          ¡Hola, {user?.name}!
        </h1>
        <p className="text-neutral-600 font-poppins">
          Gestiona tu negocio desde aquí
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 md:p-6 border border-neutral-100 animate-pulse"
              >
                <div className="h-12 w-12 bg-neutral-200 rounded-full mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              icon="📅"
              label="Citas Hoy"
              value={stats?.appointmentsToday?.toString() || '0'}
              trend={stats?.appointmentsTodayTrend}
            />
            <StatCard
              icon="💰"
              label="Ingresos del Mes"
              value={formatCurrency(stats?.monthlyRevenue || 0)}
              trend={stats?.monthlyRevenueTrend}
            />
            <StatCard
              icon="⭐"
              label="Rating Promedio"
              value={formatRating(stats?.averageRating || 0)}
            />
            <StatCard
              icon="👥"
              label="Clientes Activos"
              value={stats?.activeClients?.toString() || '0'}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 md:mb-8">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary-800 mb-4 md:mb-6">
          Gestión Rápida
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <QuickActionCard
            icon="⏳"
            title="Citas Pendientes"
            description="Revisa citas que necesitan confirmación"
            href="/provider/appointments?status=pending"
          />
          <QuickActionCard
            icon="➕"
            title="Nuevo Servicio"
            description="Agrega un nuevo servicio a tu catálogo"
            href="/provider/services/new"
          />
          <QuickActionCard
            icon="👤"
            title="Nuevo Empleado"
            description="Registra un nuevo miembro del equipo"
            href="/provider/employees/new"
          />
          <QuickActionCard
            icon="📆"
            title="Calendario"
            description="Vista mensual de todas tus citas"
            href="/provider/appointments/calendar"
          />
          <QuickActionCard
            icon="📈"
            title="Reportes"
            description="Reportes financieros y de rendimiento"
            href="/provider/reports"
          />
          <QuickActionCard
            icon="🎁"
            title="Promociones"
            description="Gestiona ofertas y promociones"
            href="/provider/promotions"
          />
          <QuickActionCard
            icon="💼"
            title="Mis Servicios"
            description="Administra tu catálogo de servicios"
            href="/provider/services"
            variant="secondary"
          />
          <QuickActionCard
            icon="📅"
            title="Citas"
            description="Gestiona reservas y confirmaciones"
            href="/provider/appointments"
            variant="secondary"
          />
          <QuickActionCard
            icon="👥"
            title="Empleados"
            description="Administra tu equipo de trabajo"
            href="/provider/employees"
            variant="secondary"
          />
          <QuickActionCard
            icon="⏰"
            title="Horarios"
            description="Configura disponibilidad y bloqueos"
            href="/provider/schedule"
            variant="secondary"
          />
          <QuickActionCard
            icon="📊"
            title="Analíticas"
            description="Ve estadísticas de tu negocio"
            href="/provider/analytics"
            variant="secondary"
          />
          <QuickActionCard
            icon="⭐"
            title="Reseñas"
            description="Lee comentarios de tus clientes"
            href="/provider/reviews"
            variant="secondary"
          />
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚀</div>
          <div>
            <h3 className="font-playfair text-xl font-bold text-primary-800 mb-2">
              Dashboard en Desarrollo
            </h3>
            <p className="text-neutral-600 font-poppins mb-4">
              Próximamente tendrás acceso a reportes avanzados, gráficos de
              rendimiento, comparativas mensuales y herramientas de marketing
              para impulsar tu negocio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
