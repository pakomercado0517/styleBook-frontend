import type { ReactNode } from 'react';
import type { Service } from '@/lib/types/services';
import { ServiceCard } from './ServiceCard';
import { EmptyState } from './EmptyState';

interface ServicesListProps {
  services: Service[];
  isLoading?: boolean;
  onSelectService?: (serviceId: number) => void;
  onToggleFavorite?: (serviceId: number) => void;
  favoriteIds?: number[];
  onToggleProviderFavorite?: (providerId: number) => void;
  favoriteProviderIds?: number[];
}

/**
 * ServicesList - Lista de servicios en grid responsive
 * Muestra servicios en tarjetas con loading y empty states
 */
export const ServicesList = ({
  services,
  isLoading = false,
  onSelectService,
  onToggleFavorite,
  favoriteIds = [],
  onToggleProviderFavorite,
  favoriteProviderIds = [],
}: ServicesListProps): ReactNode => {
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
  if (services.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No hay servicios disponibles"
        description="Por el momento no tenemos servicios para mostrar. Intenta ajustar tus filtros o vuelve más tarde."
      />
    );
  }

  // Services grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onSelect={onSelectService}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.includes(service.id)}
          onToggleProviderFavorite={onToggleProviderFavorite}
          isProviderFavorite={
            service.provider
              ? favoriteProviderIds.includes(service.provider.id)
              : false
          }
        />
      ))}
    </div>
  );
};
