'use client';

import type { ReactNode } from 'react';
import type { ProviderProfile } from '@/lib/types/provider';
import { Badge } from '@/components/Badge';

interface ProviderCardProps {
  provider: ProviderProfile;
  onSelect?: (providerId: number) => void;
  onToggleFavorite?: (providerId: number) => void;
  isFavorite?: boolean;
}

/**
 * ProviderCard - Tarjeta de proveedor con información y acciones
 * Muestra detalles del proveedor, tipo de negocio, ubicación y rating
 */
export const ProviderCard = ({
  provider,
  onSelect,
  onToggleFavorite,
  isFavorite = false,
}: ProviderCardProps): ReactNode => {
  const canSelect = onSelect !== undefined;
  const canFavorite = onToggleFavorite !== undefined;

  const handleCardClick = (): void => {
    if (canSelect) {
      onSelect(provider.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (canFavorite) {
      onToggleFavorite(provider.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  // Mapeo de tipos de negocio a español
  const businessTypeLabels: Record<string, string> = {
    salon: 'Salón de Belleza',
    barbershop: 'Barbería',
    spa: 'Spa',
    nails: 'Uñas',
    makeup: 'Maquillaje',
    hair: 'Peluquería',
    other: 'Otro',
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
      aria-label={`Proveedor: ${provider.business_name}`}
    >
      {/* Botón de favorito */}
      {canFavorite && (
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute top-4 right-4
            w-10 h-10
            bg-white rounded-full
            border-2 flex items-center justify-center
            transition-all duration-200
            z-10
            shadow-sm
            hover:shadow-md
            ${
              isFavorite
                ? 'border-red-200 hover:border-red-300 bg-red-50'
                : 'border-neutral-200 hover:border-accent-500'
            }
          `}
          type="button"
          aria-label={
            isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorite ? '#EF4444' : 'none'}
            stroke={isFavorite ? '#EF4444' : '#9CA3AF'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 transition-all duration-200"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}

      {/* Imagen del proveedor */}
      {provider.avatar_url ? (
        <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={provider.avatar_url}
            alt={provider.business_name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 mb-4 rounded-xl bg-gradient-luxe-subtle flex items-center justify-center">
          <span className="text-6xl">💼</span>
        </div>
      )}

      {/* Tipo de negocio */}
      <div className="mb-3">
        <Badge variant="secondary" className="text-xs">
          {businessTypeLabels[provider.business_type] || provider.business_type}
        </Badge>
      </div>

      {/* Nombre del negocio */}
      <h3 className="font-playfair text-xl md:text-2xl font-bold text-primary-800 mb-2 hover:text-accent-500 transition-colors">
        {provider.business_name}
      </h3>

      {/* Descripción */}
      {provider.description && (
        <p className="text-neutral-600 font-poppins text-sm mb-4 line-clamp-2">
          {provider.description}
        </p>
      )}

      {/* Ubicación */}
      {provider.city && (
        <div className="mb-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <span className="text-sm font-semibold text-primary-800">
              {provider.city}
              {provider.country && `, ${provider.country}`}
            </span>
          </div>
          {provider.address && (
            <p className="text-xs text-neutral-500 mt-1 ml-7">
              {provider.address}
            </p>
          )}
        </div>
      )}

      {/* Footer: Rating y Horario */}
      <div className="flex items-center justify-between">
        {provider.average_rating !== undefined &&
          provider.average_rating > 0 && (
            <div>
              <p className="text-xs text-neutral-500 font-poppins mb-1">
                Rating
              </p>
              <div className="flex items-center gap-1">
                <span className="text-accent-500">⭐</span>
                <p className="font-playfair text-xl font-bold text-accent-500">
                  {provider.average_rating.toFixed(1)}
                </p>
              </div>
            </div>
          )}
        {provider.opening_time && provider.closing_time && (
          <div className="text-right">
            <p className="text-xs text-neutral-500 font-poppins mb-1">
              Horario
            </p>
            <p className="font-poppins text-sm font-semibold text-primary-800">
              ⏰ {provider.opening_time} - {provider.closing_time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


