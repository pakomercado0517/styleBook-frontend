'use client';

import type { ReactNode } from 'react';
import { ReviewCard } from './ReviewCard';
import type { Review } from '@/lib/types/reviews';

interface ReviewsListProps {
  reviews: Review[];
  onReply?: (reviewId: number, response: string) => void;
  isLoading?: boolean;
}

/**
 * Lista de reseñas
 * Muestra cards de reseñas apiladas verticalmente
 */
export function ReviewsList({
  reviews,
  onReply,
  isLoading = false,
}: ReviewsListProps): ReactNode {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white font-poppins">Cargando reseñas...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-lg mb-2 font-poppins">No hay reseñas</p>
        <p className="text-neutral-300 font-poppins">
          Aún no has recibido reseñas de tus clientes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:px-0">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onReply={onReply} />
      ))}
    </div>
  );
}

