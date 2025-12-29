'use client';

import type { ReactNode } from 'react';

interface RatingDistributionChartProps {
  data: Array<{ rating: string; count: number }>;
}

/**
 * Gráfico de distribución de ratings
 * Muestra la cantidad de reseñas por cada calificación (1-5 estrellas)
 */
export function RatingDistributionChart({
  data,
}: RatingDistributionChartProps): ReactNode {
  // Calcular el total de reseñas
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Si no hay datos, mostrar mensaje
  if (total === 0) {
    return (
      <div className="px-4 py-6 md:px-0 md:py-0">
        <h2 className="text-lg font-bold text-white font-poppins mb-4">
          Distribución de Ratings
        </h2>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <p className="text-neutral-400 font-poppins text-center">
            No hay reseñas disponibles
          </p>
        </div>
      </div>
    );
  }

  // Calcular porcentajes y preparar datos para el gráfico
  const chartData = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.count / total) * 100 : 0,
  }));

  // Colores para cada rating (de mejor a peor)
  const colors = {
    '5 estrellas': '#D4AF37', // Dorado
    '4 estrellas': '#10B981', // Verde
    '3 estrellas': '#F59E0B', // Amarillo
    '2 estrellas': '#F97316', // Naranja
    '1 estrella': '#EF4444', // Rojo
  };

  return (
    <div className="px-4 py-6 md:px-0 md:py-0">
      <h2 className="text-lg font-bold text-white font-poppins mb-4">
        Distribución de Ratings
      </h2>
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="space-y-4">
          {chartData.map((item) => (
            <div key={item.rating} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white font-poppins">
                  {item.rating}
                </span>
                <span className="text-sm text-neutral-300 font-poppins">
                  {item.count} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
              {/* Barra de progreso */}
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: colors[item.rating as keyof typeof colors] || '#6B7280',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Total */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-300 font-poppins">
              Total de Reseñas
            </span>
            <span className="text-lg font-bold text-white font-poppins">
              {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

