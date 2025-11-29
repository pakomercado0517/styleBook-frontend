'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Service, ServiceCategory } from '@/lib/types/services';
import { getServices } from '@/lib/api/services';
import {
  useFavoriteServiceIds,
  useFavoriteMutations,
} from '@/lib/hooks/useFavorites';
import { ServiceSearch } from './components/ServiceSearch';
import { ServiceFilters } from './components/ServiceFilters';
import { ServicesList } from './components/ServicesList';

/**
 * Página de Catálogo de Servicios - Cliente
 * Permite buscar, filtrar y explorar servicios disponibles
 */
export default function ServicesPage(): ReactNode {
  const router = useRouter();

  // Estados
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | 'all'
  >('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Query para obtener servicios
  const {
    data: servicesResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'services',
      searchText,
      selectedCategory,
      selectedSort,
      currentPage,
    ],
    queryFn: async () => {
      const params: {
        search?: string;
        category?: string;
        sort_by?: string;
        page?: number;
        limit?: number;
        is_active?: boolean;
      } = {
        page: currentPage,
        limit: 12,
        is_active: true,
      };

      if (searchText) params.search = searchText;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedSort) params.sort_by = selectedSort;

      const result = await getServices(params);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Handlers
  const handleSearch = (text: string): void => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: ServiceCategory | 'all'): void => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string): void => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handleSelectService = (serviceId: number): void => {
    router.push(`/client/book/${serviceId}`);
  };

  // Obtener IDs de servicios favoritos
  const favoriteServiceIds = useFavoriteServiceIds();

  // Hook de mutaciones de favoritos (sin ejecutar queries innecesarias)
  const { toggleServiceFavorite } = useFavoriteMutations();

  const handleToggleFavorite = (serviceId: number): void => {
    const isFavorite = favoriteServiceIds.includes(serviceId);
    toggleServiceFavorite(serviceId, isFavorite);
  };

  // Extraer servicios y metadata - ESTRUCTURA ACTUALIZADA
  const services: Service[] = servicesResponse?.data?.data || [];
  const totalResults = servicesResponse?.data?.total || 0;
  const hasResults = services.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
          Catálogo de Servicios
        </h1>
        <p className="text-neutral-600 font-poppins text-base md:text-lg">
          Descubre y reserva los mejores servicios de belleza
        </p>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <ServiceSearch
          onSearch={handleSearch}
          placeholder="Buscar por nombre o descripción..."
          initialValue={searchText}
        />
      </div>

      {/* Filtros */}
      <div className="mb-6 md:mb-8">
        <ServiceFilters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedSort={selectedSort}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Contador de resultados */}
      {!isLoading && hasResults && (
        <div className="mb-4">
          <p className="text-sm text-neutral-600 font-poppins">
            {totalResults === 1
              ? '1 servicio encontrado'
              : `${totalResults} servicios encontrados`}
          </p>
        </div>
      )}

      {/* Lista de servicios */}
      <ServicesList
        services={services}
        isLoading={isLoading}
        onSelectService={handleSelectService}
        onToggleFavorite={handleToggleFavorite}
        favoriteIds={favoriteServiceIds}
      />

      {/* Error state */}
      {isError && !isLoading && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h3 className="font-playfair text-xl font-bold text-red-800 mb-2">
            Error al cargar servicios
          </h3>
          <p className="text-red-600 font-poppins">
            {error instanceof Error
              ? error.message
              : 'Hubo un problema al cargar los servicios. Por favor, intenta nuevamente.'}
          </p>
        </div>
      )}

      {/* Mensaje de desarrollo */}
      {!isLoading && !isError && services.length === 0 && (
        <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 border border-neutral-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-primary-800 mb-2">
                Catálogo en Desarrollo
              </h3>
              <p className="text-neutral-600 font-poppins mb-4">
                Estamos preparando nuestro catálogo de servicios. Pronto podrás
                explorar y reservar los mejores servicios de belleza cerca de
                ti.
              </p>
              <p className="text-sm text-neutral-500 font-poppins italic">
                💡 Tip: El backend está generando datos de prueba (seeds) para
                que puedas ver el catálogo en acción.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
