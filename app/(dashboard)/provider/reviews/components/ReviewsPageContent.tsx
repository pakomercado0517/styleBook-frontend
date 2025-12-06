'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ReviewsHeader } from './ReviewsHeader';
import { ReviewFilters } from './ReviewFilters';
import { ReviewsList } from './ReviewsList';
import { ReviewStatsPanel } from './ReviewStatsPanel';

type ReviewFilter = 'all' | '5' | '4' | '3' | '2' | '1';

interface Review {
  id: number;
  clientName: string;
  clientPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
  response?: string;
  respondedAt?: string;
}

/**
 * Contenido principal de la página de reseñas
 * Diseño mobile-first
 */
export function ReviewsPageContent(): ReactNode {
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>('all');

  // Datos de ejemplo - TODO: Obtener del backend
  const allReviews: Review[] = [
    {
      id: 1,
      clientName: 'Elena García',
      clientPhoto: undefined,
      rating: 5,
      comment:
        '¡Una experiencia increíble! El trato fue super profesional y el resultado superó mis expectativas. Volveré sin duda.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      clientName: 'Carlos Ruiz',
      clientPhoto: undefined,
      rating: 4,
      comment:
        'Buen servicio en general, aunque la puntualidad podría mejorar un poco. El ambiente del local es muy relajante.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      clientName: 'Ana Torres',
      clientPhoto: undefined,
      rating: 5,
      comment:
        '¡Fantástico! Un servicio de lujo. Me sentí muy cómoda y el resultado fue perfecto.',
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      response:
        '¡Muchas gracias Ana! Nos alegra enormemente que hayas tenido una experiencia fantástica. ¡Esperamos verte pronto de nuevo!',
      respondedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Filtrar reseñas según el filtro seleccionado
  const filteredReviews =
    selectedFilter === 'all'
      ? allReviews
      : allReviews.filter((review) => review.rating === Number.parseInt(selectedFilter, 10));

  // Calcular estadísticas
  const totalReviews = allReviews.length;
  const averageRating =
    allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0;
  const ratingDistribution = {
    '5': allReviews.filter((r) => r.rating === 5).length,
    '4': allReviews.filter((r) => r.rating === 4).length,
    '3': allReviews.filter((r) => r.rating === 3).length,
    '2': allReviews.filter((r) => r.rating === 2).length,
    '1': allReviews.filter((r) => r.rating === 1).length,
  };

  const handleReply = (_reviewId: number, _response: string): void => {
    // TODO: Implementar llamada al backend para responder
    toast.success('Respuesta enviada', {
      description: 'Tu respuesta se ha publicado correctamente.',
    });
    // En una implementación real, actualizarías el estado o refetch de las reseñas
  };

  return (
    <div className="min-h-full bg-[#201d12] flex flex-col">
      {/* Header */}
      <ReviewsHeader />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Mobile: Filtros de reseñas */}
        <div className="md:hidden">
          <ReviewFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        {/* Mobile: Layout vertical */}
        <div className="md:hidden">
          <div className="py-4">
            <ReviewsList reviews={filteredReviews} onReply={handleReply} />
          </div>
        </div>

        {/* Desktop: Layout de dos columnas */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6 md:px-8 md:py-6">
          {/* Columna izquierda: Lista de reseñas */}
          <div className="md:col-span-2 space-y-4">
            <ReviewsList reviews={filteredReviews} onReply={handleReply} />
          </div>

          {/* Columna derecha: Estadísticas */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <ReviewStatsPanel
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingDistribution={ratingDistribution}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

