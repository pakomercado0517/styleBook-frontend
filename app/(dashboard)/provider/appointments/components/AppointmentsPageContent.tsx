'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { AppointmentsHeader } from './AppointmentsHeader';
import { AppointmentsTabs } from './AppointmentsTabs';
import { ProviderAppointmentsList } from './ProviderAppointmentsList';
import { TodayAppointmentsPanel } from './TodayAppointmentsPanel';

type TabType = 'today' | 'upcoming' | 'pending';

/**
 * Contenido principal de la página de citas del proveedor
 * Diseño mobile-first con layout de 3 columnas en desktop
 */
export function AppointmentsPageContent(): ReactNode {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Calcular fechas según el tab activo
  const getDateRange = () => {
    const today = new Date();
    switch (activeTab) {
      case 'today':
        return {
          start: format(startOfDay(today), "yyyy-MM-dd'T'00:00:00"),
          end: format(endOfDay(today), "yyyy-MM-dd'T'23:59:59"),
        };
      case 'upcoming':
        return {
          start: format(startOfDay(today), "yyyy-MM-dd'T'00:00:00"),
          end: undefined, // Sin límite de fin
        };
      case 'pending':
        return {
          start: undefined,
          end: undefined,
        };
      default:
        return {
          start: undefined,
          end: undefined,
        };
    }
  };

  const dateRange = getDateRange();
  const statusFilter = activeTab === 'pending' ? 'pending' : undefined;

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header */}
      <AppointmentsHeader />

      {/* Mobile: Tabs y Lista */}
      <div className="md:hidden flex-1 flex flex-col">
        {/* Tabs de filtro */}
        <AppointmentsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Lista de citas */}
        <div className="flex-1 px-4 py-6 pb-20 space-y-4 overflow-y-auto">
          <ProviderAppointmentsList
            status={statusFilter}
            startDate={dateRange.start}
            endDate={dateRange.end}
            filterByTab={activeTab}
          />
        </div>
      </div>

      {/* Desktop: Layout de 2 columnas (Lista de Citas + Panel de Hoy) */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Columna izquierda: Tabs y Lista de Citas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs de filtro */}
          <div className="px-6 pt-6">
            <AppointmentsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Lista de citas */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            <ProviderAppointmentsList
              status={statusFilter}
              startDate={dateRange.start}
              endDate={dateRange.end}
              filterByTab={activeTab}
            />
          </div>
        </div>

        {/* Columna derecha: Citas para Hoy */}
        <div className="w-96 p-6 border-l border-white/10">
          <div className="h-full">
            <TodayAppointmentsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
