'use client';

import { Button } from '@/components/Button';

type FilterType = 'all' | 'providers' | 'services';

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'providers', label: 'Proveedores' },
  { value: 'services', label: 'Servicios' },
];

interface FavoritesFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FavoritesFilters({
  activeFilter,
  onFilterChange,
}: FavoritesFiltersProps) {
  const handleFilterClick = (filter: FilterType): void => {
    onFilterChange(filter);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          variant={activeFilter === value ? 'primary' : 'outline'}
          onClick={() => handleFilterClick(value)}
          aria-label={`Filtrar por ${label}`}
          aria-pressed={activeFilter === value}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
