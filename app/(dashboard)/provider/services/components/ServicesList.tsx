import type { ReactNode } from 'react';
import { ServiceCard } from './ServiceCard';
import { Button } from '@/components/Button';
import type { Service } from '@/lib/types/services';

interface ServicesListProps {
  services: Service[];
  total: number;
  limit: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  error?: string;
  onPageChange: (page: number) => void;
  onEdit: (serviceId: number) => void;
}

/**
 * Lista de servicios con paginación
 */
export function ServicesList({
  services,
  total,
  limit,
  currentPage,
  isLoading,
  isError,
  error,
  onPageChange,
  onEdit,
}: ServicesListProps): ReactNode {
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Cargando servicios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {error || 'Error al cargar los servicios'}
        </p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg mb-4">
          No tienes servicios registrados
        </p>
        <p className="text-neutral-500">
          Crea tu primer servicio haciendo clic en "Nuevo Servicio"
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={onEdit}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Anterior
          </Button>
          <span className="text-neutral-600 font-poppins px-4">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="md"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </Button>
        </div>
      )}
    </div>
  );
}

