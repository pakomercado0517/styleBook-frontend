'use client';

import type { ReactNode } from 'react';
import { ServiceCard } from './ServiceCard';
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
 * Lista de servicios - Diseño mobile
 */
export function ServicesList({
  services,
  isLoading,
  isError,
  error,
  onEdit,
}: ServicesListProps): ReactNode {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white font-poppins">Cargando servicios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-poppins">
          {error || 'Error al cargar los servicios'}
        </p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-lg mb-4 font-poppins">
          No tienes servicios registrados
        </p>
        <p className="text-neutral-300 font-poppins">
          Crea tu primer servicio haciendo clic en "Añadir Nuevo Servicio"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} onEdit={onEdit} />
      ))}
    </div>
  );
}

