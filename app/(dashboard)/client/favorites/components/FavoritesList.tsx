'use client';

import { useState } from 'react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { FavoriteCard } from './FavoriteCard';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

type FilterType = 'all' | 'providers' | 'services';

interface FavoritesListProps {
  filter: FilterType;
}

const ITEMS_PER_PAGE = 12;

export function FavoritesList({ filter }: FavoritesListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const {
    favorites,
    total,
    isLoading,
    isError,
    error,
  } = useFavorites({
    filter,
    limit: ITEMS_PER_PAGE,
    offset,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const hasResults = favorites.length > 0;

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-neutral-600">Cargando favoritos...</p>
      </Card>
    );
  }

  // Error state
  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error al cargar los favoritos';

    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">{errorMessage}</p>
      </Card>
    );
  }

  // Empty state
  if (!hasResults) {
    const emptyMessages = {
      all: 'No tienes favoritos guardados',
      providers: 'No tienes proveedores favoritos',
      services: 'No tienes servicios favoritos',
    };

    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl">⭐</span>
          <p className="text-neutral-600 text-lg">{emptyMessages[filter]}</p>
        </div>
      </Card>
    );
  }

  // Favorites grid
  return (
    <div className="flex flex-col gap-6">
      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600 font-poppins">
          {total === 1
            ? '1 favorito encontrado'
            : `${total} favoritos encontrados`}
        </p>
      </div>

      {/* Grid de favoritos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <FavoriteCard key={favorite.id} favorite={favorite} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            ← Anterior
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Mostrar primera, última, actual y adyacentes
                return (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                );
              })
              .map((page, index, array) => {
                // Agregar elipsis si hay gap
                const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                return (
                  <div key={page} className="flex items-center gap-2">
                    {showEllipsisBefore && (
                      <span className="text-neutral-400">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? 'primary' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Ir a página ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            Siguiente →
          </Button>
        </div>
      )}
    </div>
  );
}
