'use client';

import type { ReactNode } from 'react';
import { DesktopContentHeader } from '@/components/navigation/DesktopContentHeader';
import { UpcomingAppointmentsList } from './components/UpcomingAppointmentsList';
import { RecommendedServicesCarousel } from './components/RecommendedServicesCarousel';

/**
 * Dashboard Home - Cliente
 * Diseño inspirado en template moderno, minimalista y profesional
 * Mobile-first con paleta Luxe Noir
 */
export default function ClientDashboardPage(): ReactNode {
  return (
    <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md md:max-w-full flex-col overflow-x-hidden bg-[#121212] dark:bg-[#121212]">
      {/* Header con título y acciones - Solo visible en desktop */}
      <DesktopContentHeader title="Dashboard" />

      {/* Sección: Próximas Citas */}
      <div className="px-4 md:px-0">
        <h2 className="px-0 pb-3 pt-5 md:pt-0 text-[22px] md:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-white font-playfair">
          Próximas Citas
        </h2>
        <UpcomingAppointmentsList />
      </div>

      {/* Sección: Recomendado para Ti */}
      <div className="px-0">
        <h2 className="px-4 md:px-0 pb-3 pt-8 text-[22px] md:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-white font-playfair">
          Recomendado
        </h2>
        <RecommendedServicesCarousel />
      </div>

      {/* Spacer para empujar contenido hacia arriba en móvil */}
      <div className="mgrow min-h-8"></div>
    </div>
  );
}
