'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFavorite } from '@/lib/api/favorites';
import type { Favorite } from '@/lib/types/favorites';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

interface FavoriteCardProps {
  favorite: Favorite;
}

export function FavoriteCard({ favorite }: FavoriteCardProps) {
  const queryClient = useQueryClient();

  const { mutate: handleRemove, isPending } = useMutation({
    mutationFn: () => deleteFavorite(favorite.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Si es un proveedor favorito
  if (favorite.provider) {
    return (
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-playfair text-xl font-bold text-primary-800">
                {favorite.provider.business_name}
              </h3>
              <p className="text-sm text-neutral-600">
                {favorite.provider.business_type}
              </p>
            </div>
            <Badge variant="primary">
              ⭐ {favorite.provider.average_rating}
            </Badge>
          </div>

          <p className="text-neutral-600">{favorite.provider.city}</p>

          <Button
            variant="outline"
            onClick={() => handleRemove()}
            disabled={isPending}
          >
            {isPending ? 'Eliminando...' : 'Eliminar de Favoritos'}
          </Button>
        </div>
      </Card>
    );
  }

  // Si es un servicio favorito
  if (favorite.service) {
    return (
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <h3 className="font-playfair text-xl font-bold text-primary-800">
              {favorite.service.name}
            </h3>
            <p className="text-lg font-semibold text-primary-800">
              ${favorite.service.price}
            </p>
          </div>

          <p className="text-neutral-600">{favorite.service.description}</p>

          <Button
            variant="outline"
            onClick={() => handleRemove()}
            disabled={isPending}
          >
            {isPending ? 'Eliminando...' : 'Eliminar de Favoritos'}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
