'use client';

import type { ReactNode } from 'react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { ReviewsHeader } from './ReviewsHeader';
import { ReviewFilters } from './ReviewFilters';
import { ReviewsList } from './ReviewsList';
import { ReviewStatsPanel } from './ReviewStatsPanel';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import {
  useProviderReviews,
  useProviderReviewStats,
} from '@/lib/hooks/useReviews';
import type { Review } from '@/lib/types/reviews';

type ReviewFilter = 'all' | '5' | '4' | '3' | '2' | '1';

/**
 * Contenido principal de la página de reseñas
 * Diseño mobile-first
 */
export function ReviewsPageContent(): ReactNode {
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>('all');

  // Obtener el perfil del proveedor autenticado
  const { data: providerProfile, isLoading: isLoadingProvider } =
    useMyProviderProfile();
  const providerId = providerProfile?.id;

  // Obtener reseñas del proveedor
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useProviderReviews(providerId || 0, {
    limit: 100, // Obtener todas las reseñas
  });

  // Obtener estadísticas de rating
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useProviderReviewStats(providerId || 0);

  // Convertir reseñas del backend al formato esperado por los componentes
  const allReviews: Review[] = useMemo(() => {
    if (!reviewsData?.data) return [];

    return reviewsData.data.map((review) => ({
      ...review,
      // El backend puede incluir client como relación
      // Si no está, usar datos por defecto
    }));
  }, [reviewsData]);

  // Filtrar reseñas según el filtro seleccionado
  const filteredReviews = useMemo(() => {
    if (selectedFilter === 'all') {
      return allReviews;
    }
    return allReviews.filter(
      (review) => review.rating === Number.parseInt(selectedFilter, 10)
    );
  }, [allReviews, selectedFilter]);

  // Calcular estadísticas desde los datos del backend o usar statsData
  const totalReviews = statsData?.total_reviews || allReviews.length;
  const averageRating =
    statsData?.average_rating ||
    (allReviews.length > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
        allReviews.length
      : 0);
  const ratingDistribution = statsData?.rating_distribution || {
    '5': allReviews.filter((r) => r.rating === 5).length,
    '4': allReviews.filter((r) => r.rating === 4).length,
    '3': allReviews.filter((r) => r.rating === 3).length,
    '2': allReviews.filter((r) => r.rating === 2).length,
    '1': allReviews.filter((r) => r.rating === 1).length,
  };

  const handleReply = (_reviewId: number, _response: string): void => { // eslint-disable-line @typescript-eslint/no-unused-vars
    // TODO: Implementar llamada al backend para responder cuando esté disponible
    toast.success('Respuesta enviada', {
      description: 'Tu respuesta se ha publicado correctamente.',
    });
    // En una implementación real, actualizarías el estado o refetch de las reseñas
  };

  // Estados de carga
  const isLoading = isLoadingProvider || isLoadingReviews || isLoadingStats;

  // Manejo de errores
  if (reviewsError || statsError) {
    return (
      <div className="min-h-full bg-[#121212] flex flex-col">
        <ReviewsHeader />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-white text-lg mb-2 font-poppins">
              Error al cargar las reseñas
            </p>
            <p className="text-neutral-400 font-poppins">
              {reviewsError?.message || statsError?.message || 'Error desconocido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#121212] flex flex-col">
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
            <ReviewsList
              reviews={filteredReviews}
              onReply={handleReply}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Desktop: Layout de dos columnas */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6 md:px-8 md:py-6">
          {/* Columna izquierda: Lista de reseñas */}
          <div className="md:col-span-2 space-y-4">
            <ReviewsList
              reviews={filteredReviews}
              onReply={handleReply}
              isLoading={isLoading}
            />
          </div>

          {/* Columna derecha: Estadísticas */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <ReviewStatsPanel
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingDistribution={ratingDistribution}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

