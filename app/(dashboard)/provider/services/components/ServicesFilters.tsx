import type { ReactNode } from 'react';
import { Select } from '@/components/Select';
import type { ServiceCategory } from '@/lib/types/services';

interface ServicesFiltersProps {
  selectedCategory: ServiceCategory | 'all';
  statusFilter: 'all' | 'active' | 'inactive';
  onCategoryChange: (category: ServiceCategory | 'all') => void;
  onStatusChange: (status: 'all' | 'active' | 'inactive') => void;
}

/**
 * Componente de filtros para servicios
 */
export function ServicesFilters({
  selectedCategory,
  statusFilter,
  onCategoryChange,
  onStatusChange,
}: ServicesFiltersProps): ReactNode {
  const categoryOptions = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'corte', label: 'Corte' },
    { value: 'tinte', label: 'Tinte' },
    { value: 'peinado', label: 'Peinado' },
    { value: 'manicure', label: 'Manicure' },
    { value: 'pedicure', label: 'Pedicure' },
    { value: 'tratamiento_capilar', label: 'Tratamiento Capilar' },
    { value: 'barba', label: 'Barba' },
    { value: 'afeitado', label: 'Afeitado' },
    { value: 'masaje', label: 'Masaje' },
    { value: 'facial', label: 'Facial' },
    { value: 'corporal', label: 'Corporal' },
    { value: 'aromaterapia', label: 'Aromaterapia' },
    { value: 'limpieza_dental', label: 'Limpieza Dental' },
    { value: 'estetica_dental', label: 'Estética Dental' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Select
          label="Categoría"
          value={selectedCategory}
          onChange={(e) =>
            onCategoryChange(e.target.value as ServiceCategory | 'all')
          }
          options={categoryOptions}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          label="Estado"
          value={statusFilter}
          onChange={(e) =>
            onStatusChange(
              e.target.value as 'all' | 'active' | 'inactive'
            )
          }
          options={statusOptions}
        />
      </div>
    </div>
  );
}

