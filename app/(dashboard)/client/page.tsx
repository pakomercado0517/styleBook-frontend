'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';

/**
 * Dashboard Home - Cliente
 * Muestra resumen de actividad y accesos rápidos a funcionalidades principales
 */
export default function ClientDashboardPage(): ReactNode {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
          ¡Hola, {user?.name}!
        </h1>
        <p className="text-neutral-600 font-poppins">
          Bienvenido de vuelta a StyleBook
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard icon="📅" label="Próximas Citas" value="3" />
        <StatCard icon="⭐" label="Reseñas Escritas" value="12" />
        <StatCard icon="❤️" label="Favoritos" value="8" />
        <StatCard icon="✨" label="Servicios Usados" value="24" />
      </div>

      {/* Quick Actions */}
      <div className="mb-6 md:mb-8">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary-800 mb-4 md:mb-6">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <QuickActionCard
            icon="🛍️"
            title="Catálogo de Servicios"
            description="Explora y reserva los mejores servicios de belleza"
            href="/client/services"
          />
          <QuickActionCard
            icon="📅"
            title="Mis Citas"
            description="Gestiona tus reservas y próximas citas"
            href="/client/appointments"
          />
          <QuickActionCard
            icon="❤️"
            title="Favoritos"
            description="Revisa tus servicios y proveedores favoritos"
            href="/client/favorites"
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
              Estamos trabajando en traerte la mejor experiencia. Próximamente
              podrás ver tu historial completo, recomendaciones personalizadas y
              mucho más.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
