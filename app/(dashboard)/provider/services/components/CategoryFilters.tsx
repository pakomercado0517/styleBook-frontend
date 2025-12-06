'use client';

import type { ReactNode } from 'react';
import type { ServiceCategory } from '@/lib/types/services';

interface CategoryFiltersProps {
  selectedCategory: ServiceCategory | 'all';
  onCategoryChange: (category: ServiceCategory | 'all') => void;
}

/**
 * Filtros de categorías como botones ovalados
 * Mobile: botones horizontales scrollables
 */
export function CategoryFilters({
  selectedCategory,
  onCategoryChange,
}: CategoryFiltersProps): ReactNode {
  const categories: Array<{ value: ServiceCategory | 'all'; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'facial', label: 'Facial' },
    { value: 'corporal', label: 'Corporal' },
    { value: 'tratamiento_capilar', label: 'Capilar' },
  ];

  return (
    <div className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.value;
        return (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className="px-6 py-3 rounded-full font-semibold font-poppins transition-colors whitespace-nowrap flex-shrink-0"
            style={
              isSelected
                ? {
                    backgroundColor: '#D4AF37',
                    color: '#1A1A1A',
                  }
                : {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }
            }
            type="button"
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

