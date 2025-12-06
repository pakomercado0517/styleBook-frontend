'use client';

import type { ReactNode } from 'react';

interface AppointmentsPerDayChartProps {
  data: Array<{ day: string; count: number }>;
}

/**
 * Gráfico de citas por día
 * Gráfico de barras verticales
 */
export function AppointmentsPerDayChart({
  data,
}: AppointmentsPerDayChartProps): ReactNode {
  // Calcular valores para el gráfico
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const chartHeight = 150;
  const barWidth = 40;
  const barSpacing = 20;
  const totalWidth = data.length * (barWidth + barSpacing) - barSpacing;

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-white font-poppins mb-4">
        Citas por Día
      </h2>
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="relative w-full overflow-x-auto">
          <div className="relative" style={{ height: `${chartHeight}px`, minWidth: `${totalWidth}px` }}>
            {/* Grid lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${totalWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={(i / 4) * chartHeight}
                  x2={totalWidth}
                  y2={(i / 4) * chartHeight}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              ))}
            </svg>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-5">
              {data.map((item) => {
                const barHeight = (item.count / maxCount) * chartHeight;
                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center"
                    style={{ width: `${barWidth}px` }}
                  >
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${barHeight}px`,
                        backgroundColor: '#D4AF37',
                        minHeight: barHeight > 0 ? '4px' : '0',
                      }}
                    />
                    <span className="text-xs text-neutral-400 font-poppins mt-2">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

