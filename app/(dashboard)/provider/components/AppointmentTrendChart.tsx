'use client';

import type { ReactNode } from 'react';

interface AppointmentTrendChartProps {
  total: number;
  trend: number;
  period: string; // "Últimos 7 días", etc.
  data?: number[]; // Datos para el gráfico [lun, mar, mié, etc.]
}

/**
 * Gráfico de tendencia de citas
 * Muestra un gráfico de línea simple con los últimos 7 días
 */
export function AppointmentTrendChart({
  total,
  trend,
  period,
  data = [20, 25, 18, 30, 22, 28, 25], // Datos de ejemplo
}: AppointmentTrendChartProps): ReactNode {
  const maxValue = Math.max(...data, 1);
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Normalizar datos para el gráfico (0-100%)
  const normalizedData = data.map((value) => (value / maxValue) * 100);

  // Generar puntos del path SVG
  const points = normalizedData.map((value, index) => {
    const x = (index / (normalizedData.length - 1)) * 100;
    const y = 100 - value;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white font-playfair">
          Tendencia de Citas
        </h2>
      </div>

      {/* Valor total y tendencia */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold text-white font-poppins">
            {total}
          </span>
          <span className="text-sm text-green-400 font-poppins">
            +{trend}%
          </span>
        </div>
        <p className="text-xs text-neutral-300 font-poppins">{period}</p>
      </div>

      {/* Gráfico SVG */}
      <div className="w-full h-32 relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Línea del gráfico */}
          <path
            d={pathData}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Área bajo la curva */}
          <path
            d={`${pathData} L 100,100 L 0,100 Z`}
            fill="url(#gradient)"
            opacity="0.2"
          />
          {/* Gradiente para el área */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Etiquetas de días */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
          {days.map((day, index) => (
            <span
              key={index}
              className="text-xs text-neutral-400 font-poppins"
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

