'use client';

import type { ReactNode } from 'react';

interface ServiceDistributionChartProps {
  data: Array<{ service: string; percentage: number }>;
}

/**
 * Gráfico de distribución de servicios
 * Gráfico de donut (anillo)
 */
export function ServiceDistributionChart({
  data,
}: ServiceDistributionChartProps): ReactNode {
  // Calcular el total para normalizar porcentajes
  const total = data.reduce((sum, item) => sum + item.percentage, 0);
  const normalizedData = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.percentage / total) * 100 : 0,
  }));

  // Configuración del gráfico donut
  const size = 200;
  const radius = 80;
  const strokeWidth = 30;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calcular los arcos
  // Para un círculo SVG, empezamos desde el top (por el -rotate-90)
  // El offset inicial debe ser circumference para que el primer arco comience en el top
  let currentOffset = circumference;
  const arcs = normalizedData.map((item, index) => {
    const percentage = item.percentage;
    const strokeDasharray = (percentage / 100) * circumference;
    // El offset actual es donde comienza este arco
    const strokeDashoffset = currentOffset;
    // Actualizar el offset para el siguiente arco
    currentOffset -= strokeDasharray;

    // Colores: primero dorado, luego gris
    const color = index === 0 ? '#D4AF37' : '#6B7280';

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      color,
    };
  });

  return (
    <div className="px-4 py-6 md:px-0 md:py-0">
      <h2 className="text-lg font-bold text-white font-poppins mb-4">
        Distribución de Servicios
      </h2>
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Círculo de fondo (gris) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
            />
            {/* Arcos de datos */}
            {arcs.map((arc, index) => (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth={strokeWidth}
                strokeDasharray={arc.strokeDasharray}
                strokeDashoffset={arc.strokeDashoffset}
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

