'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { AnalyticsPageContent } from './components/AnalyticsPageContent';
import { AnalyticsPageSkeleton } from './components/AnalyticsPageSkeleton';

/**
 * Página de análisis del proveedor
 * Muestra métricas, gráficos y estadísticas del negocio
 */
export default function AnalyticsPage(): ReactNode {
  return (
    <Suspense fallback={<AnalyticsPageSkeleton />}>
      <AnalyticsPageContent />
    </Suspense>
  );
}

