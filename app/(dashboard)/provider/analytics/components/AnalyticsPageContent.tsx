'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { AnalyticsHeader } from './AnalyticsHeader';
import { TimeFrameFilters } from './TimeFrameFilters';
import { MetricsGrid } from './MetricsGrid';
import { IncomeTrendChart } from './IncomeTrendChart';
import { ServiceDistributionChart } from './ServiceDistributionChart';

type TimeFrame = 'today' | 'weekly' | 'monthly' | 'annual' | 'custom';

/**
 * Contenido principal de la página de análisis
 * Diseño mobile-first
 */
export function AnalyticsPageContent(): ReactNode {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('monthly');

  // Datos de ejemplo - TODO: Obtener del backend
  const metrics = {
    totalAppointments: 124,
    netIncome: 5830,
    newClients: 18,
    popularService: 'Corte Luxe',
    retentionRate: 75,
  };

  // Datos de ejemplo para gráfico de ingresos
  const incomeTrendData = [
    { date: 'Lun', income: 1200 },
    { date: 'Mar', income: 1500 },
    { date: 'Mié', income: 1100 },
    { date: 'Jue', income: 1800 },
    { date: 'Vie', income: 1600 },
  ];

  // Datos de ejemplo para gráfico de distribución de servicios
  const serviceDistributionData = [
    { service: 'Corte Luxe', percentage: 65 },
    { service: 'Otros', percentage: 35 },
  ];

  return (
    <div className="min-h-full bg-[#121212] flex flex-col">
      {/* Header */}
      <AnalyticsHeader
        selectedTimeFrame={selectedTimeFrame}
        onTimeFrameChange={setSelectedTimeFrame}
      />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Mobile: Filtros de tiempo */}
        <div className="md:hidden">
          <TimeFrameFilters
            selectedTimeFrame={selectedTimeFrame}
            onTimeFrameChange={setSelectedTimeFrame}
          />
        </div>

        {/* Grid de métricas */}
        <div className="mb-6">
          <MetricsGrid
            totalAppointments={metrics.totalAppointments}
            netIncome={metrics.netIncome}
            newClients={metrics.newClients}
            popularService={metrics.popularService}
            retentionRate={metrics.retentionRate}
          />
        </div>

        {/* Mobile: Gráficos apilados */}
        <div className="md:hidden space-y-6">
          <IncomeTrendChart data={incomeTrendData} />
          <ServiceDistributionChart data={serviceDistributionData} />
        </div>

        {/* Desktop: Gráficos lado a lado */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 md:px-8">
          <IncomeTrendChart data={incomeTrendData} />
          <ServiceDistributionChart data={serviceDistributionData} />
        </div>
      </div>
    </div>
  );
}

