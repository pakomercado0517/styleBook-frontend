'use client';

import type { ReactNode } from 'react';
import { MetricCard } from './MetricCard';

interface MetricsGridProps {
  totalAppointments: number;
  netIncome: number;
  newClients: number;
  popularService: string;
  retentionRate?: number;
}

/**
 * Grid de métricas
 * Mobile: 2x2 grid con 4 cards
 * Desktop: 5 cards en horizontal
 */
export function MetricsGrid({
  totalAppointments,
  netIncome,
  newClients,
  popularService,
  retentionRate = 75,
}: MetricsGridProps): ReactNode {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* Mobile: Grid 2x2 */}
      <div className="grid grid-cols-2 gap-3 px-4 md:hidden">
        <MetricCard title="Citas Totales" value={totalAppointments} />
        <MetricCard title="Ingresos Netos" value={formatCurrency(netIncome)} />
        <MetricCard title="Clientes Nuevos" value={newClients} />
        <MetricCard title="Servicio Popular" value={popularService} />
      </div>

      {/* Desktop: 5 cards en horizontal */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-4 md:px-8">
        <MetricCard title="Citas Totales" value={totalAppointments} />
        <MetricCard title="Ingresos Netos" value={formatCurrency(netIncome)} />
        <MetricCard title="Clientes Nuevos" value={newClients} />
        <MetricCard title="Servicio Popular" value={popularService} />
        <MetricCard title="Tasa de Retención" value={`${retentionRate}%`} />
      </div>
    </>
  );
}

