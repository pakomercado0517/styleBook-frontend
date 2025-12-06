'use client';

import type { ReactNode } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { FavoriteCard } from './FavoriteCard';

type FilterType = 'services' | 'providers';

interface FavoritesListProps {
  filter: FilterType;
}

/**
 * FavoritesList - Lista de favoritos
 * Muestra servicios o proveedores favoritos según el filtro
 */
export const FavoritesList = ({ filter }: FavoritesListProps): ReactNode => {
  const {
    favorites,
    isLoading,
    isError,
    error,
  } = useFavorites({
    filter,
    limit: 50,
    offset: 0,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error al cargar los favoritos';

    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400 font-poppins">{errorMessage}</p>
      </div>
    );
  }

  // Empty state
  if (!favorites || favorites.length === 0) {
    const emptyMessages = {
      providers: 'No tienes proveedores favoritos',
      services: 'No tienes servicios favoritos',
    };

    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Heart className="w-16 h-16 text-neutral-400" strokeWidth={1.5} />
          <p className="text-neutral-300 text-lg font-poppins">{emptyMessages[filter]}</p>
        </div>
      </div>
    );
  }

  // Filtro de favoritos según el tipo
  const filteredFavorites = favorites.filter((favorite) => {
    if (filter === 'services') {
      return favorite.service_id !== undefined && favorite.service !== undefined;
    }
    if (filter === 'providers') {
      return favorite.provider_id !== undefined && favorite.provider !== undefined;
    }
    return true;
  });

  if (filteredFavorites.length === 0) {
    const emptyMessages = {
      providers: 'No tienes proveedores favoritos',
      services: 'No tienes servicios favoritos',
    };

    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Heart className="w-16 h-16 text-neutral-400" strokeWidth={1.5} />
          <p className="text-neutral-300 text-lg font-poppins">{emptyMessages[filter]}</p>
        </div>
      </div>
    );
  }

  // Lista de favoritos
  return (
    <div className="space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:space-y-0">
      {filteredFavorites.map((favorite) => (
        <FavoriteCard key={favorite.id} favorite={favorite} />
      ))}
    </div>
  );
};
