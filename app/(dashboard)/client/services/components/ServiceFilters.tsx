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
  const categories: Array<{
    value: ServiceCategory | 'all';
    label: string;
    icon: string;
  }> = [
    { value: 'all', label: 'Todos', icon: '✨' },
    { value: 'hair', label: 'Cabello', icon: '💇' },
    { value: 'facial', label: 'Facial', icon: '🧖' },
    { value: 'nails', label: 'Uñas', icon: '💅' },
    { value: 'makeup', label: 'Maquillaje', icon: '💄' },
    { value: 'massage', label: 'Masajes', icon: '💆' },
    { value: 'spa', label: 'Spa', icon: '🧘' },
    { value: 'barber', label: 'Barbería', icon: '💈' },
    { value: 'other', label: 'Otros', icon: '🎨' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'price_asc', label: 'Menor precio' },
    { value: 'price_desc', label: 'Mayor precio' },
    { value: 'rating', label: 'Mejor valorados' },
    { value: 'name', label: 'Nombre A-Z' },
  ];

  const handleCategoryClick = (category: ServiceCategory | 'all'): void => {
    onCategoryChange(category);
  };

  const handleCategoryKeyDown = (
    e: React.KeyboardEvent,
    category: ServiceCategory | 'all'
  ): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(category);
    }
  };

  return (
    <div className="space-y-6">
      {/* Categorías */}
      <div>
        <h3 className="font-poppins font-semibold text-primary-800 mb-3 text-sm md:text-base">
          Categorías
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                onKeyDown={(e) => handleCategoryKeyDown(e, category.value)}
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
                aria-label={`Filtrar por ${category.label}`}
                aria-pressed={isActive}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            );
          })}
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
            aria-label="Ordenar servicios"
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
