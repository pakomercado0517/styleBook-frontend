'use client';

import type { ReactNode } from 'react';

type NotificationFilter = 'all' | 'reservations' | 'messages' | 'reviews';

interface NotificationFiltersProps {
  selectedFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
}

/**
 * Filtros de notificaciones por tipo
 * Tabs horizontales
 */
export function NotificationFilters({
  selectedFilter,
  onFilterChange,
}: NotificationFiltersProps): ReactNode {
  const filters: Array<{ value: NotificationFilter; label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: 'reservations', label: 'Reservas' },
    { value: 'messages', label: 'Mensajes' },
    { value: 'reviews', label: 'Reseñas' },
  ];

  return (
    <div className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className="px-6 py-3 rounded-xl font-semibold font-poppins transition-colors whitespace-nowrap shrink-0"
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
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

