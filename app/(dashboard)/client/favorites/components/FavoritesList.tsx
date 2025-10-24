'use client';

import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '@/lib/api/favorites';
import { FavoriteCard } from './FavoriteCard';
import { Card } from '@/components/Card';

export function FavoritesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavorites(),
  });

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-neutral-600">Cargando favoritos...</p>
      </Card>
    );
  }

  if (error || !data?.success) {
    const errorMessage =
      data && !data.success ? data.error : 'Error al cargar los favoritos';

    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">{errorMessage}</p>
      </Card>
    );
  }

  if (data.data.favorites.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-neutral-600">No tienes favoritos guardados</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.data.favorites.map((favorite) => (
        <FavoriteCard key={favorite.id} favorite={favorite} />
      ))}
    </div>
  );
}
