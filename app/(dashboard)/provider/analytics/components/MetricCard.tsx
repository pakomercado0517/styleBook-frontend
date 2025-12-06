'use client';

import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

/**
 * Card de métrica
 * Muestra título y valor
 */
export function MetricCard({ title, value }: MetricCardProps): ReactNode {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-neutral-300 font-poppins mb-2">
        {title}
      </h3>
      <p className="text-2xl font-bold text-white font-poppins">{value}</p>
    </div>
  );
}

