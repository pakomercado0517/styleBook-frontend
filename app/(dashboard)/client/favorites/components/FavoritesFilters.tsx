'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';

type FilterType = 'all' | 'providers' | 'services';

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'providers', label: 'Proveedores' },
  { value: 'services', label: 'Servicios' },
];

export function FavoritesFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          variant={activeFilter === value ? 'primary' : 'outline'}
          onClick={() => setActiveFilter(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
