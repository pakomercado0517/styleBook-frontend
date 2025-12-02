'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';

/**
 * Dashboard Home - Cliente
 * Diseño moderno, minimalista y profesional con enfoque mobile-first
 */
export default function ClientDashboardPage(): ReactNode {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Header Section - Moderno y acogedor */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm md:text-base text-neutral-500 font-poppins mb-1">
              {new Date().toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
              ¡Hola, {user?.name?.split(' ')[0] || 'Usuario'}! 👋
            </h1>
          </div>
        </div>
        <p className="text-base md:text-lg text-neutral-600 font-poppins">
          Bienvenido de vuelta a StyleBook
        </p>
      </div>

      {/* Stats Grid - Diseño moderno con gradientes */}
      <div className="mb-10 md:mb-12">
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-primary-800 mb-5 md:mb-6">
          Tu Resumen
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            icon="📅"
            label="Próximas Citas"
            value="3"
            gradient="purple"
          />
          <StatCard
            icon="⭐"
            label="Reseñas Escritas"
            value="12"
            gradient="gold"
          />
          <StatCard
            icon="❤️"
            label="Favoritos"
            value="8"
            gradient="pink"
          />
          <StatCard
            icon="✨"
            label="Servicios Usados"
            value="24"
            gradient="blue"
          />
        </div>
      </div>

      {/* Quick Actions - Cards elegantes */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h2 className="font-playfair text-xl md:text-2xl font-bold text-primary-800">
            Acciones Rápidas
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <QuickActionCard
            icon="🛍️"
            title="Catálogo de Servicios"
            description="Explora y reserva los mejores servicios de belleza"
            href="/client/services"
          />
          <QuickActionCard
            icon="💼"
            title="Proveedores"
            description="Descubre los mejores profesionales cerca de ti"
            href="/client/providers"
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

      {/* Inspirational Section - Minimalista */}
      <div
        className="
          relative overflow-hidden
          bg-gradient-to-br from-accent-50/50 via-white to-purple-50/30
          rounded-3xl p-6 md:p-8
          border border-accent-100/50
        "
      >
        <div className="relative z-10">
          <div className="flex items-start gap-4 md:gap-5">
            <div
              className="
                w-14 h-14 md:w-16 md:h-16
                rounded-2xl
                bg-gradient-to-br from-accent-400 to-accent-500
                flex items-center justify-center
                text-2xl md:text-3xl
                shadow-lg shadow-accent-500/20
                flex-shrink-0
              "
            >
              ✨
            </div>
            <div className="flex-1">
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-primary-800 mb-2">
                Tu belleza, nuestra pasión
              </h3>
              <p className="text-sm md:text-base text-neutral-600 font-poppins leading-relaxed">
                Estamos trabajando constantemente para traerte la mejor
                experiencia. Próximamente podrás ver tu historial completo,
                recomendaciones personalizadas y mucho más.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div
          className="
            absolute top-0 right-0
            w-32 h-32 md:w-40 md:h-40
            bg-gradient-to-br from-accent-200/20 to-transparent
            rounded-bl-full
            -mr-16 -mt-16
          "
        />
        <div
          className="
            absolute bottom-0 left-0
            w-24 h-24 md:w-32 md:h-32
            bg-gradient-to-tr from-purple-200/20 to-transparent
            rounded-tr-full
            -ml-12 -mb-12
          "
        />
      </div>
    </div>
  );
}
