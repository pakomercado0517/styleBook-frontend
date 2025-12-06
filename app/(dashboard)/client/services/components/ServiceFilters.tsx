import type { ReactNode } from 'react';
import type { ServiceCategory } from '@/lib/types/services';

interface ServiceFiltersProps {
  selectedCategory: ServiceCategory | 'all';
  onCategoryChange: (category: ServiceCategory | 'all') => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

/**
 * ServiceFilters - Filtros para el catálogo de servicios
 * Permite filtrar por categoría y ordenar resultados
 */
export const ServiceFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
}: ServiceFiltersProps): ReactNode => {
  const handleCategoryClick = (category: ServiceCategory | 'all'): void => {
    onCategoryChange(category);
  };

  // Crear chips de filtros (Todos, Categoría, Ubicación, Precio, Calificación)
  const filterChips = [
    {
      label: 'Todos',
      value: 'all',
      isActive: selectedCategory === 'all',
      onClick: () => handleCategoryClick('all'),
      hasDropdown: false,
    },
    {
      label: 'Categoría',
      value: 'category',
      isActive: selectedCategory !== 'all',
      onClick: () => {
        // TODO: Abrir dropdown de categorías
      },
      hasDropdown: true,
    },
    {
      label: 'Ubicación',
      value: 'location',
      isActive: false,
      onClick: () => {
        // TODO: Abrir dropdown de ubicación
      },
      hasDropdown: true,
    },
    {
      label: 'Precio',
      value: 'price',
      isActive: selectedSort === 'price_asc' || selectedSort === 'price_desc',
      onClick: () => {
        // TODO: Abrir dropdown de precio
      },
      hasDropdown: true,
    },
    {
      label: 'Calificación',
      value: 'rating',
      isActive: selectedSort === 'rating',
      onClick: () => {
        onSortChange('rating');
      },
      hasDropdown: true,
    },
  ];

  return (
    <div className="flex gap-3 pt-4 overflow-x-auto pb-1 scrollbar-hide">
      {filterChips.map((chip) => (
        <button
          key={chip.value}
          onClick={chip.onClick}
          className={`
            flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-3
            font-poppins text-sm font-medium leading-normal transition-all duration-200
            ${
              chip.isActive
                ? ''
                : 'bg-white/5 text-white border border-white/10'
            }
          `}
          style={
            chip.isActive
              ? { 
                  color: '#D4AF37', // Texto dorado como solicitó
                  backgroundColor: 'rgba(26, 26, 26, 0.8)' // Fondo oscuro para contraste
                }
              : undefined
          }
          type="button"
          aria-label={chip.label}
          aria-pressed={chip.isActive}
        >
          <p>{chip.label}</p>
          {chip.hasDropdown && (
            <svg
              className="w-5 h-5"
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
          )}
        </button>
      ))}
    </div>
  );
};
