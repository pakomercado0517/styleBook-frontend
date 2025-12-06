'use client';

import type { ReactNode } from 'react';

interface IncomeTrendChartProps {
  data: Array<{ date: string; income: number }>;
}

/**
 * Gráfico de tendencia de ingresos
 * Línea con área rellena
 */
export function IncomeTrendChart({ data }: IncomeTrendChartProps): ReactNode {
  // Calcular valores para el gráfico
  const maxIncome = Math.max(...data.map((d) => d.income), 1);
  const chartHeight = 150;
  const chartWidth = 300;

  // Generar puntos para la línea
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * chartWidth;
    const y = chartHeight - (item.income / maxIncome) * chartHeight;
    return `${x},${y}`;
  });

  // Generar puntos para el área (incluyendo el fondo)
  const areaPoints = [
    `0,${chartHeight}`,
    ...points,
    `${chartWidth},${chartHeight}`,
  ].join(' ');

  return (
    <div className="px-4 py-6 md:px-0 md:py-0">
      <h2 className="text-lg font-bold text-white font-poppins mb-4">
        Tendencia de Ingresos
      </h2>
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="relative w-full" style={{ height: `${chartHeight}px` }}>
          {/* Grid lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={(i / 4) * chartHeight}
                x2={chartWidth}
                y2={(i / 4) * chartHeight}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            ))}
          </svg>

          {/* Area fill con gradiente */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={areaPoints}
              fill="url(#incomeGradient)"
            />
          </svg>

          {/* Line */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <polyline
              points={points.join(' ')}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

