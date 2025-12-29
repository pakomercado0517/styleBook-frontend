'use client';

import type { ReactNode } from 'react';
import type { BusinessType } from '@/lib/types/provider';

interface ProviderFiltersProps {
  selectedBusinessType: BusinessType | 'all';
  onBusinessTypeChange: (type: BusinessType | 'all') => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

/**
 * ProviderFilters - Filtros para el catálogo de proveedores
 * Permite filtrar por tipo de negocio, ciudad, rating y ordenar resultados
 */
export const ProviderFilters = ({
  selectedBusinessType,
  onBusinessTypeChange,
  selectedCity,
  onCityChange,
  minRating,
  onMinRatingChange,
  selectedSort,
  onSortChange,
}: ProviderFiltersProps): ReactNode => {
  const businessTypes: Array<{
    value: BusinessType | 'all';
    label: string;
    icon: string;
  }> = [
    { value: 'all', label: 'Todos', icon: '✨' },
    { value: 'salon', label: 'Salón de Belleza', icon: '💇' },
    { value: 'barbershop', label: 'Barbería', icon: '✂️' },
    { value: 'spa', label: 'Spa', icon: '🧖' },
    { value: 'nails', label: 'Uñas', icon: '💅' },
    { value: 'makeup', label: 'Maquillaje', icon: '💄' },
    { value: 'hair', label: 'Peluquería', icon: '💆' },
    { value: 'other', label: 'Otro', icon: '💼' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'rating', label: 'Mejor valorados' },
    { value: 'name', label: 'Nombre A-Z' },
  ];

  const ratingOptions = [
    { value: 0, label: 'Todos' },
    { value: 3, label: '3+ ⭐' },
    { value: 4, label: '4+ ⭐' },
    { value: 4.5, label: '4.5+ ⭐' },
  ];

  const handleBusinessTypeClick = (type: BusinessType | 'all'): void => {
    onBusinessTypeChange(type);
  };

  const handleBusinessTypeKeyDown = (
    e: React.KeyboardEvent,
    type: BusinessType | 'all'
  ): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBusinessTypeClick(type);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tipo de negocio */}
      <div>
        <h3 className="font-poppins font-semibold text-primary-800 mb-3 text-sm md:text-base">
          Tipo de Negocio
        </h3>
        <div className="flex flex-wrap gap-2">
          {businessTypes.map((type) => {
            const isActive = selectedBusinessType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => handleBusinessTypeClick(type.value)}
                onKeyDown={(e) => handleBusinessTypeKeyDown(e, type.value)}
                className={`
                  px-4 py-2 rounded-full
                  font-poppins text-sm font-medium
                  border-2 transition-all duration-200
                  min-h-[44px] flex items-center gap-2
                  ${
                    isActive
                      ? 'bg-accent-500 text-primary-900 border-accent-600 shadow-md'
                      : 'bg-white text-primary-800 border-neutral-200 hover:border-accent-500/50'
                  }
                `}
                type="button"
                aria-label={`Filtrar por ${type.label}`}
                aria-pressed={isActive}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ciudad y Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ciudad */}
        <div>
          <h3 className="font-poppins font-semibold text-primary-800 mb-3 text-sm md:text-base">
            Ciudad
          </h3>
          <input
            type="text"
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Ej: Ciudad de México"
            className="
              w-full px-4 py-3
              bg-white border-2 border-neutral-200
              rounded-lg
              font-poppins text-sm
              text-primary-800
              placeholder:text-neutral-400
              hover:border-accent-500/50
              focus:border-accent-500
              focus:outline-none
              focus:ring-2 focus:ring-accent-500/20
              transition-all duration-200
            "
            aria-label="Filtrar por ciudad"
          />
        </div>

        {/* Rating mínimo */}
        <div>
          <h3 className="font-poppins font-semibold text-primary-800 mb-3 text-sm md:text-base">
            Rating Mínimo
          </h3>
          <div className="relative">
            <select
              value={minRating}
              onChange={(e) => onMinRatingChange(Number(e.target.value))}
              className="
                w-full px-4 py-3 pr-10
                bg-white border-2 border-neutral-200
                rounded-lg
                font-poppins text-sm
                text-primary-800
                hover:border-accent-500/50
                focus:border-accent-500
                focus:outline-none
                focus:ring-2 focus:ring-accent-500/20
                transition-all duration-200
                cursor-pointer
                appearance-none
              "
              aria-label="Filtrar por rating mínimo"
            >
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* Custom arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-primary-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Ordenamiento */}
      <div>
        <h3 className="font-poppins font-semibold text-primary-800 mb-3 text-sm md:text-base">
          Ordenar por
        </h3>
        <div className="relative">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="
              w-full px-4 py-3 pr-10
              bg-white border-2 border-neutral-200
              rounded-lg
              font-poppins text-sm
              text-primary-800
              hover:border-accent-500/50
              focus:border-accent-500
              focus:outline-none
              focus:ring-2 focus:ring-accent-500/20
              transition-all duration-200
              cursor-pointer
              appearance-none
            "
            aria-label="Ordenar proveedores"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-primary-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

















