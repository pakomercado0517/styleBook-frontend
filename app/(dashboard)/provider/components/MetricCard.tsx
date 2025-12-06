'use client';

import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string; // "vs ayer", "vs mes", etc.
  };
  className?: string;
}

/**
 * Card de métrica con valor y tendencia
 * Estilo Luxe Noir con fondo oscuro y acentos dorados
 */
export function MetricCard({
  title,
  value,
  trend,
  className = '',
}: MetricCardProps): ReactNode {
  const trendColor = trend
    ? trend.isPositive
      ? 'text-green-400'
      : 'text-orange-400'
    : '';

  return (
    <div
      className={`bg-white/5 rounded-xl p-4 border border-white/10 ${className}`}
    >
      <p className="text-sm text-white font-poppins mb-2">{title}</p>
      <p className="text-2xl font-bold text-white font-poppins mb-1">
        {value}
      </p>
      {trend && (
        <p className={`text-xs font-poppins ${trendColor}`}>
          {trend.isPositive ? '+' : '-'}
          {typeof trend.value === 'number' && trend.value < 1
            ? trend.value.toFixed(1)
            : trend.value}
          {typeof trend.value === 'number' && trend.value >= 1 ? '%' : ''}{' '}
          {trend.label}
        </p>
      )}
    </div>
  );
}

