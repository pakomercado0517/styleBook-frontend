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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col items-stretch justify-start rounded-xl bg-white/5 overflow-hidden animate-pulse"
          >
            <div className="w-full aspect-video bg-white/10" />
            <div className="flex w-full grow flex-col items-stretch justify-center gap-1 p-4">
              <div className="h-4 bg-white/10 rounded w-20 mb-2" />
              <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
              <div className="flex items-end justify-between mt-1">
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="h-4 bg-white/10 rounded w-20" />
              </div>
            </div>
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

  // Services grid: 1 columna en móvil, 3 columnas en desktop
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
