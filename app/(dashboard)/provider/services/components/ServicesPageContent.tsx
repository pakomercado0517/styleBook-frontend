'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { useProviderServices } from '@/lib/hooks/useServices';
import { ServicesList } from './ServicesList';
import { ServicesFilters } from './ServicesFilters';
import { ServiceFormModal } from './ServiceFormModal';
import { Button } from '@/components/Button';
import type { ServiceCategory } from '@/lib/types/services';

/**
 * Contenido principal de la página de servicios del proveedor
 */
export function ServicesPageContent(): ReactNode {
  const { data: providerProfile, isLoading: isLoadingProfile } =
    useMyProviderProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | 'all'
  >('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all'
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<number | null>(null);

  const limit = 12;
  const offset = (currentPage - 1) * limit;

  // Query para obtener servicios del proveedor
  const {
    data: servicesResponse,
    isLoading: isLoadingServices,
    isError,
    error,
  } = useProviderServices(providerProfile?.id, {
    limit,
    offset,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
  });

  const handleCreateService = (): void => {
    setEditingService(null);
    setIsFormModalOpen(true);
  };

  const handleEditService = (serviceId: number): void => {
    setEditingService(serviceId);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsFormModalOpen(false);
    setEditingService(null);
  };

  if (isLoadingProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-12">
        <div className="text-center">
          <p className="text-neutral-600">Cargando perfil del proveedor...</p>
        </div>
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-12">
        <div className="text-center">
          <p className="text-red-600">
            No se pudo cargar el perfil del proveedor
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-12">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
            Mis Servicios
          </h1>
          <p className="text-neutral-600 font-poppins">
            Gestiona tu catálogo de servicios
          </p>
        </div>
        <Button
          variant="gold"
          size="lg"
          onClick={handleCreateService}
          className="w-full sm:w-auto"
        >
          ➕ Nuevo Servicio
        </Button>
      </div>

      {/* Filters */}
      <ServicesFilters
        selectedCategory={selectedCategory}
        statusFilter={statusFilter}
        onCategoryChange={(category) => {
          setSelectedCategory(category);
          setCurrentPage(1);
        }}
        onStatusChange={(status) => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
      />

      {/* Services List */}
      <ServicesList
        services={servicesResponse?.data?.data || []}
        total={servicesResponse?.data?.total || 0}
        limit={limit}
        currentPage={currentPage}
        isLoading={isLoadingServices}
        isError={isError}
        error={error?.message}
        onPageChange={setCurrentPage}
        onEdit={handleEditService}
      />

      {/* Form Modal */}
      {isFormModalOpen && (
        <ServiceFormModal
          providerId={providerProfile.id}
          serviceId={editingService}
          isOpen={isFormModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

