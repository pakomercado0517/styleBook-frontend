'use client';

import type { ReactNode } from 'react';
import { Star } from 'lucide-react';

interface ReviewStatsPanelProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

/**
 * Panel de estadísticas de reseñas
 * Desktop: Muestra rating promedio y distribución por estrellas
 */
export function ReviewStatsPanel({
  averageRating,
  totalReviews,
  ratingDistribution,
}: ReviewStatsPanelProps): ReactNode {
  const maxCount = Math.max(
    ratingDistribution['5'],
    ratingDistribution['4'],
    ratingDistribution['3'],
    ratingDistribution['2'],
    ratingDistribution['1']
  );

  const getRatingPercentage = (count: number): number => {
    if (maxCount === 0) return 0;
    return (count / maxCount) * 100;
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white font-poppins mb-6">
        Estadísticas de Reseñas
      </h2>

      {/* Rating promedio */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl font-bold text-white font-poppins">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-5 h-5"
                style={{ color: '#D4AF37' }}
                fill={
                  star <= Math.round(averageRating) ? '#D4AF37' : 'transparent'
                }
                strokeWidth={2}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-neutral-300 font-poppins mb-1">
          Calificación promedio
        </p>
        <p className="text-sm text-neutral-400 font-poppins">
          Basado en {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
        </p>
      </div>

      {/* Distribución por rating */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating.toString() as keyof typeof ratingDistribution];
          const percentage = getRatingPercentage(count);
          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12 shrink-0">
                <span className="text-sm text-white font-poppins">{rating}</span>
                <Star
                  className="w-4 h-4"
                  style={{ color: '#D4AF37' }}
                  fill="#D4AF37"
                  strokeWidth={2}
                />
              </div>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: '#D4AF37',
                  }}
                />
              </div>
              <span className="text-sm text-white font-poppins w-12 text-right shrink-0">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

