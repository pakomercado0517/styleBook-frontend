import type { ReactNode } from 'react';
import type { Service } from '@/lib/types/services';
import { Badge } from '@/components/Badge';

interface ServiceCardProps {
  service: Service;
  onSelect?: (serviceId: number) => void;
  onToggleFavorite?: (serviceId: number) => void;
  isFavorite?: boolean;
}

/**
 * ServiceCard - Tarjeta de servicio con información y acciones
 * Muestra detalles del servicio, proveedor, precio y duración
 */
export const ServiceCard = ({
  service,
  onSelect,
  onToggleFavorite,
  isFavorite = false,
}: ServiceCardProps): ReactNode => {
  const canSelect = onSelect !== undefined;
  const canFavorite = onToggleFavorite !== undefined;

  const handleCardClick = (): void => {
    if (canSelect) {
      onSelect(service.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (canFavorite) {
      onToggleFavorite(service.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  // Formatear precio
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(service.price);

  // Formatear duración
  const hours = Math.floor(service.duration_minutes / 60);
  const minutes = service.duration_minutes % 60;
  const formattedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  // Mapeo de categorías a español
  const categoryLabels: Record<string, string> = {
    hair: 'Cabello',
    facial: 'Facial',
    nails: 'Uñas',
    makeup: 'Maquillaje',
    massage: 'Masajes',
    spa: 'Spa',
    barber: 'Barbería',
    other: 'Otros',
  };

  return (
    <div
      className="
        bg-white rounded-2xl p-6 
        border border-neutral-200 
        hover:border-accent-500/30
        hover:shadow-2xl hover:shadow-accent-500/10
        transition-all duration-300
        cursor-pointer
        relative
      "
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Servicio: ${service.name}`}
    >
      {/* Botón de favorito */}
      {canFavorite && (
        <button
          onClick={handleFavoriteClick}
          className="
            absolute top-4 right-4
            w-10 h-10
            bg-white rounded-full
            border-2 border-neutral-200
            hover:border-accent-500
            flex items-center justify-center
            transition-all duration-200
            z-10
          "
          type="button"
          aria-label={
            isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
          }
        >
          <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
        </button>
      )}

      {/* Imagen del servicio */}
      {service.image_url ? (
        <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 mb-4 rounded-xl bg-gradient-luxe-subtle flex items-center justify-center">
          <span className="text-6xl">💇</span>
        </div>
      )}

      {/* Categoría */}
      <div className="mb-3">
        <Badge variant="secondary" className="text-xs">
          {categoryLabels[service.category] || service.category}
        </Badge>
      </div>

      {/* Nombre del servicio */}
      <h3 className="font-playfair text-xl md:text-2xl font-bold text-primary-800 mb-2 hover:text-accent-500 transition-colors">
        {service.name}
      </h3>

      {/* Descripción */}
      <p className="text-neutral-600 font-poppins text-sm mb-4 line-clamp-2">
        {service.description}
      </p>

      {/* Proveedor */}
      {service.provider && (
        <div className="mb-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">Por:</span>
            <span className="text-sm font-semibold text-primary-800">
              {service.provider.business_name}
            </span>
          </div>
          {service.provider.average_rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-accent-500">⭐</span>
              <span className="text-sm font-semibold text-primary-800">
                {service.provider.average_rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer: Precio y Duración */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-500 font-poppins mb-1">Precio</p>
          <p className="font-playfair text-2xl font-bold text-accent-500">
            {formattedPrice}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 font-poppins mb-1">Duración</p>
          <p className="font-poppins text-lg font-semibold text-primary-800">
            ⏱️ {formattedDuration}
          </p>
        </div>
      </div>

      {/* Rating si existe */}
      {service.average_rating !== undefined && service.average_rating > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-accent-500">⭐</span>
              <span className="text-sm font-semibold text-primary-800">
                {service.average_rating.toFixed(1)}
              </span>
            </div>
            {service.total_reviews !== undefined &&
              service.total_reviews > 0 && (
                <span className="text-xs text-neutral-500 font-poppins">
                  {service.total_reviews}{' '}
                  {service.total_reviews === 1 ? 'reseña' : 'reseñas'}
                </span>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
