'use client';

import { useRouter } from 'next/navigation';
import type { Favorite } from '@/lib/types/favorites';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

interface FavoriteCardProps {
  favorite: Favorite;
}

export function FavoriteCard({ favorite }: FavoriteCardProps) {
  const router = useRouter();
  const {
    toggleServiceFavorite,
    toggleProviderFavorite,
    isRemovingService,
    isRemovingProvider,
  } = useFavorites();

  const handleRemove = (): void => {
    if (favorite.service_id) {
      toggleServiceFavorite(favorite.service_id, true);
    } else if (favorite.provider_id) {
      toggleProviderFavorite(favorite.provider_id, true);
    }
  };

  const handleViewDetails = (): void => {
    if (favorite.service_id) {
      router.push(`/client/book/${favorite.service_id}`);
    } else if (favorite.provider_id) {
      // TODO: Navegar a página de proveedor cuando esté disponible
      router.push(`/client/services?provider=${favorite.provider_id}`);
    }
  };

  const isPending = isRemovingService || isRemovingProvider;

  // Si es un proveedor favorito
  if (favorite.provider) {
    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-playfair text-xl font-bold text-primary-800">
                {favorite.provider.business_name}
              </h3>
              <p className="text-sm text-neutral-600">
                {favorite.provider.business_type}
              </p>
            </div>
            {favorite.provider.average_rating > 0 && (
              <Badge variant="primary">
                ⭐ {favorite.provider.average_rating.toFixed(1)}
              </Badge>
            )}
          </div>

          <p className="text-neutral-600">{favorite.provider.city}</p>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleViewDetails}
              className="flex-1"
            >
              Ver Detalles
            </Button>
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={isPending}
            >
              {isPending ? 'Eliminando...' : '❤️'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Si es un servicio favorito
  if (favorite.service) {
    // Formatear precio
    const formattedPrice = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(favorite.service.price);

    // Formatear duración
    const hours = Math.floor(favorite.service.duration_minutes / 60);
    const minutes = favorite.service.duration_minutes % 60;
    const formattedDuration =
      hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-playfair text-xl font-bold text-primary-800">
                {favorite.service.name}
              </h3>
              <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                {favorite.service.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
            <div>
              <p className="text-xs text-neutral-500 mb-1">Precio</p>
              <p className="font-playfair text-xl font-bold text-accent-500">
                {formattedPrice}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 mb-1">Duración</p>
              <p className="font-poppins text-sm font-semibold text-primary-800">
                ⏱️ {formattedDuration}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleViewDetails}
              className="flex-1"
            >
              Reservar
            </Button>
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={isPending}
              aria-label="Eliminar de favoritos"
            >
              {isPending ? 'Eliminando...' : '❤️'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
