'use client';

import type { ReactNode } from 'react';

/**
 * Sección de tendencias de ingresos
 */
export function IncomeTrends(): ReactNode {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h2 className="text-lg font-bold text-white font-playfair mb-4">
        Tendencias de Ingresos
      </h2>
      <div className="h-64 flex items-center justify-center">
        <p className="text-neutral-400 font-poppins text-sm">
          Gráfico de tendencias aquí
        </p>
      </div>
    </div>
  );
}

