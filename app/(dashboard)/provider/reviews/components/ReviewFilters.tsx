'use client';

import type { ReactNode } from 'react';
import { Star } from 'lucide-react';

type ReviewFilter = 'all' | '5' | '4' | '3' | '2' | '1';

interface ReviewFiltersProps {
  selectedFilter: ReviewFilter;
  onFilterChange: (filter: ReviewFilter) => void;
}

/**
 * Filtros de reseñas por rating
 * Botones ovalados horizontales scrollables
 */
export function ReviewFilters({
  selectedFilter,
  onFilterChange,
}: ReviewFiltersProps): ReactNode {
  const filters: Array<{ value: ReviewFilter; label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: '5', label: '5' },
    { value: '4', label: '4' },
    { value: '3', label: '3' },
    { value: '2', label: '2' },
    { value: '1', label: '1' },
  ];

  return (
    <div className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className="flex items-center gap-1 px-6 py-3 rounded-full font-semibold font-poppins transition-colors whitespace-nowrap shrink-0"
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
            {filter.value !== 'all' && (
              <Star
                className="w-4 h-4"
                fill={isSelected ? '#1A1A1A' : '#D4AF37'}
                style={{ color: isSelected ? '#1A1A1A' : '#D4AF37' }}
                strokeWidth={2}
              />
            )}
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}

