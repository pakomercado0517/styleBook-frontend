'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';

/**
 * Dashboard Home - Proveedor
 * Muestra estadísticas de negocio y accesos rápidos a gestión
 */
export default function ProviderDashboardPage(): ReactNode {
  const { user } = useAuth();

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
        <StatCard
          icon="📅"
          label="Citas Hoy"
          value="12"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          icon="💰"
          label="Ingresos del Mes"
          value="$2,450"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard icon="⭐" label="Rating Promedio" value="4.8" />
        <StatCard icon="👥" label="Clientes Activos" value="156" />
      </div>

      {/* Quick Actions */}
      <div className="mb-6 md:mb-8">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary-800 mb-4 md:mb-6">
          Gestión Rápida
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <QuickActionCard
            icon="💼"
            title="Mis Servicios"
            description="Administra tu catálogo de servicios"
            href="/provider/services"
          />
          <QuickActionCard
            icon="📅"
            title="Citas"
            description="Gestiona reservas y confirmaciones"
            href="/provider/appointments"
          />
          <QuickActionCard
            icon="👥"
            title="Empleados"
            description="Administra tu equipo de trabajo"
            href="/provider/employees"
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
