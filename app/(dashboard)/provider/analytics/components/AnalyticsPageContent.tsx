'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useProviderAnalytics, type TimeFrame } from '@/lib/hooks/useProviderAnalytics';
import { AnalyticsHeader } from './AnalyticsHeader';
import { TimeFrameFilters } from './TimeFrameFilters';
import { MetricsGrid } from './MetricsGrid';
import { IncomeTrendChart } from './IncomeTrendChart';
import { ServiceDistributionChart } from './ServiceDistributionChart';
import { RatingDistributionChart } from './RatingDistributionChart';

/**
 * Contenido principal de la página de análisis
 * Diseño mobile-first
 */
export function AnalyticsPageContent(): ReactNode {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('monthly');

  // Obtener datos reales de la API con filtro de período
  const {
    metrics,
    isLoading,
    isError,
    error,
  } = useProviderAnalytics(selectedTimeFrame);

  // Preparar datos de distribución de ratings para el gráfico
  const ratingDistributionData = metrics.ratingDistribution
    ? [
        { rating: '5 estrellas', count: metrics.ratingDistribution['5'] },
        { rating: '4 estrellas', count: metrics.ratingDistribution['4'] },
        { rating: '3 estrellas', count: metrics.ratingDistribution['3'] },
        { rating: '2 estrellas', count: metrics.ratingDistribution['2'] },
        { rating: '1 estrella', count: metrics.ratingDistribution['1'] },
      ]
    : [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-full bg-[#121212] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-full bg-[#121212] flex items-center justify-center px-4">
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 text-center max-w-md">
          <p className="text-red-400 font-poppins">
            {error instanceof Error ? error.message : 'Error al cargar las estadísticas'}
          </p>
        </div>
      </div>
    );
  }

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
            averageRating={metrics.averageRating}
            totalReviews={metrics.totalReviews}
          />
        </div>

        {/* Mobile: Gráficos apilados */}
        <div className="md:hidden space-y-6 px-4">
          <RatingDistributionChart data={ratingDistributionData} />
          <IncomeTrendChart data={metrics.incomeTrendData} />
          <ServiceDistributionChart data={metrics.serviceDistributionData} />
        </div>

        {/* Desktop: Gráficos lado a lado */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 md:px-8">
          <RatingDistributionChart data={ratingDistributionData} />
          <IncomeTrendChart data={metrics.incomeTrendData} />
          <ServiceDistributionChart data={metrics.serviceDistributionData} />
        </div>
      </div>
    </div>
  );
}

