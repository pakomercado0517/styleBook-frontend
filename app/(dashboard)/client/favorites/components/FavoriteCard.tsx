'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star } from 'lucide-react';
import type { Favorite } from '@/lib/types/favorites';
import { useFavorites } from '@/lib/hooks/useFavorites';

interface FavoriteCardProps {
  favorite: Favorite;
}

/**
 * FavoriteCard - Card de servicio favorito
 * Diseño mobile-first con imagen, título, descripción y rating
 */
export const FavoriteCard = ({ favorite }: FavoriteCardProps): ReactNode => {
  const router = useRouter();
  const {
    toggleServiceFavorite,
    toggleProviderFavorite,
    isRemovingService,
    isRemovingProvider,
  } = useFavorites();

  // Si es un servicio favorito
  if (favorite.service) {
    const service = favorite.service;
    const serviceImage = service.image_url;
    const rating = service.provider?.average_rating || 0;
    const reviewsCount: number = 124; // Valor por defecto, se podría obtener del backend

    const handleToggleFavorite = (e: React.MouseEvent): void => {
      e.stopPropagation();
      if (service.id) {
        toggleServiceFavorite(service.id, true);
      }
    };

    const handleCardClick = (): void => {
      router.push(`/client/services/${service.id}`);
    };

    const isPending = isRemovingService;

    return (
      <div
        className="rounded-xl overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity relative"
        onClick={handleCardClick}
      >
        {/* Mobile Layout */}
        <div className="md:hidden bg-white/5 border border-white/10">
          <div className="flex gap-4 p-4">
            {/* Imagen del servicio */}
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              {serviceImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={serviceImage}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                  <span className="text-2xl">💇</span>
                </div>
              )}
            </div>

            {/* Información del servicio */}
            <div className="flex-1 min-w-0">
              {/* Header con título y corazón */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-lg font-bold text-white font-playfair flex-1">
                  {service.name}
                </h3>
                <button
                  onClick={handleToggleFavorite}
                  disabled={isPending}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Eliminar de favoritos"
                  type="button"
                >
                  <Heart
                    className="w-5 h-5"
                    style={{ color: '#D4AF37' }}
                    fill="#D4AF37"
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Descripción */}
              {service.description && (
                <p className="text-sm text-neutral-300 font-poppins mb-3 line-clamp-2">
                  {service.description}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star
                  className="w-4 h-4"
                  style={{ color: '#D4AF37' }}
                  fill="#D4AF37"
                  strokeWidth={2}
                />
                <span className="text-sm text-white font-poppins">
                  {rating.toFixed(1)} ({reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block bg-white/5 rounded-xl overflow-hidden border border-white/10">
          {/* Sección de imagen con overlay */}
          <div className="relative h-64 overflow-hidden">
            {/* Imagen de fondo */}
            {serviceImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={serviceImage}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center">
                <span className="text-6xl">💇</span>
              </div>
            )}

            {/* Overlay oscuro en la parte inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

            {/* Icono de corazón en esquina superior derecha */}
            <div className="absolute top-4 right-4">
              <button
                onClick={handleToggleFavorite}
                disabled={isPending}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Eliminar de favoritos"
                type="button"
              >
                <Heart
                  className="w-5 h-5"
                  style={{ color: '#D4AF37' }}
                  fill="#D4AF37"
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Contenido sobre la imagen (título, descripción, rating) */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white font-playfair mb-2">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-sm text-neutral-200 font-poppins mb-3 line-clamp-2">
                  {service.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Star
                  className="w-5 h-5"
                  style={{ color: '#D4AF37' }}
                  fill="#D4AF37"
                  strokeWidth={2}
                />
                <span className="text-base text-white font-poppins font-semibold">
                  {rating.toFixed(1)} ({reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>
          </div>

          {/* Botón de acción en la parte inferior */}
          <div className="p-4">
            <button
              onClick={handleCardClick}
              className="w-full h-12 rounded-lg font-semibold font-poppins transition-colors"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              Reservar Ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si es un proveedor favorito
  if (favorite.provider) {
    const provider = favorite.provider;
    const providerImage = (provider as { cover_url?: string; avatar_url?: string })?.cover_url || 
                          (provider as { cover_url?: string; avatar_url?: string })?.avatar_url;
    const rating = provider.average_rating || 0;
    const reviewsCount: number = 88; // Valor por defecto, se podría obtener del backend

    const handleToggleFavorite = (e: React.MouseEvent): void => {
      e.stopPropagation();
      if (provider.id) {
        toggleProviderFavorite(provider.id, true);
      }
    };

    const handleCardClick = (): void => {
      // TODO: Navegar a página de proveedor cuando esté disponible
      // router.push(`/client/providers/${provider.id}`);
    };

    const isPending = isRemovingProvider;

    return (
      <div
        className="rounded-xl overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity relative"
        onClick={handleCardClick}
      >
        {/* Mobile Layout */}
        <div className="md:hidden bg-white/5 border border-white/10">
          <div className="flex gap-4 p-4">
            {/* Imagen del proveedor */}
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              {providerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={providerImage}
                  alt={provider.business_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
              )}
            </div>

            {/* Información del proveedor */}
            <div className="flex-1 min-w-0">
              {/* Header con título y corazón */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-lg font-bold text-white font-playfair flex-1">
                  {provider.business_name}
                </h3>
                <button
                  onClick={handleToggleFavorite}
                  disabled={isPending}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Eliminar de favoritos"
                  type="button"
                >
                  <Heart
                    className="w-5 h-5"
                    style={{ color: '#D4AF37' }}
                    fill="#D4AF37"
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Tipo de negocio */}
              <p className="text-sm text-neutral-300 font-poppins mb-3">
                {provider.business_type}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star
                  className="w-4 h-4"
                  style={{ color: '#D4AF37' }}
                  fill="#D4AF37"
                  strokeWidth={2}
                />
                <span className="text-sm text-white font-poppins">
                  {rating.toFixed(1)} ({reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block bg-white/5 rounded-xl overflow-hidden border border-white/10">
          {/* Sección de imagen con overlay */}
          <div className="relative h-64 overflow-hidden">
            {/* Imagen de fondo */}
            {providerImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={providerImage}
                alt={provider.business_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                <span className="text-6xl">🏢</span>
              </div>
            )}

            {/* Overlay oscuro en la parte inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

            {/* Icono de corazón en esquina superior derecha */}
            <div className="absolute top-4 right-4">
              <button
                onClick={handleToggleFavorite}
                disabled={isPending}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Eliminar de favoritos"
                type="button"
              >
                <Heart
                  className="w-5 h-5"
                  style={{ color: '#D4AF37' }}
                  fill="#D4AF37"
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Contenido sobre la imagen (título, tipo, rating) */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white font-playfair mb-2">
                {provider.business_name}
              </h3>
              <p className="text-sm text-neutral-200 font-poppins mb-3">
                {provider.business_type}
              </p>
              <div className="flex items-center gap-2">
                <Star
                  className="w-5 h-5"
                  style={{ color: '#D4AF37' }}
                  fill="#D4AF37"
                  strokeWidth={2}
                />
                <span className="text-base text-white font-poppins font-semibold">
                  {rating.toFixed(1)} ({reviewsCount} {reviewsCount === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>
          </div>

          {/* Botón de acción en la parte inferior */}
          <div className="p-4">
            <button
              onClick={handleCardClick}
              className="w-full h-12 rounded-lg font-semibold font-poppins transition-colors"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1A1A1A',
              }}
              type="button"
            >
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
