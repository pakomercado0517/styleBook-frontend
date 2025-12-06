'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useMyProviderProfile } from '@/lib/hooks/useMyProviderProfile';
import { useProviderServices } from '@/lib/hooks/useServices';
import { ServicesList } from './ServicesList';
import { ServiceFormModal } from './ServiceFormModal';
import { ServicesHeader } from './ServicesHeader';
import { AddServiceButton } from './AddServiceButton';
import { CategoryFilters } from './CategoryFilters';
import type { ServiceCategory } from '@/lib/types/services';

/**
 * Contenido principal de la página de servicios del proveedor
 * Diseño mobile-first
 */
export function ServicesPageContent(): ReactNode {
  const { data: providerProfile, isLoading: isLoadingProfile } =
    useMyProviderProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | 'all'
  >('all');
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
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <ServicesHeader onCreateService={handleCreateService} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white font-poppins">Cargando perfil del proveedor...</p>
        </div>
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col">
        <ServicesHeader onCreateService={handleCreateService} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400 font-poppins">
            No se pudo cargar el perfil del proveedor
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#201d12] flex flex-col">
      {/* Header */}
      <ServicesHeader onCreateService={handleCreateService} />

      {/* Contenido principal */}
      <div className="flex-1 px-4 py-6 pb-20 md:px-8 md:py-8 space-y-4 md:space-y-6">
        {/* Mobile: Botón Añadir Nuevo Servicio */}
        <div className="md:hidden">
          <AddServiceButton onClick={handleCreateService} />
        </div>

        {/* Filtros de categorías */}
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setCurrentPage(1);
          }}
        />

        {/* Lista de servicios */}
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
      </div>

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

