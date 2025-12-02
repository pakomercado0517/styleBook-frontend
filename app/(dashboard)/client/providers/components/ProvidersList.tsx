'use client';

import type { ReactNode } from 'react';
import type { ProviderProfile } from '@/lib/types/provider';
import { ProviderCard } from './ProviderCard';
import { EmptyState } from '../../services/components/EmptyState';

interface ProvidersListProps {
  providers: ProviderProfile[];
  isLoading?: boolean;
  onSelectProvider?: (providerId: number) => void;
  onToggleFavorite?: (providerId: number) => void;
  favoriteIds?: number[];
}

/**
 * ProvidersList - Lista de proveedores en grid responsive
 * Muestra proveedores en tarjetas con loading y empty states
 */
export const ProvidersList = ({
  providers,
  isLoading = false,
  onSelectProvider,
  onToggleFavorite,
  favoriteIds = [],
}: ProvidersListProps): ReactNode => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-neutral-200 animate-pulse"
          >
            <div className="w-full h-48 bg-neutral-200 rounded-xl mb-4" />
            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-3" />
            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
            <div className="h-4 bg-neutral-200 rounded w-2/3 mb-4" />
            <div className="h-8 bg-neutral-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (providers.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No hay proveedores disponibles"
        description="Por el momento no tenemos proveedores para mostrar. Intenta ajustar tus filtros o vuelve más tarde."
      />
    );
  }

  // Providers grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          onSelect={onSelectProvider}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.includes(provider.id)}
        />
      ))}
    </div>
  );
};

