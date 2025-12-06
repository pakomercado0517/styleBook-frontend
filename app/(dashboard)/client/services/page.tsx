'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Service, ServiceCategory } from '@/lib/types/services';
import { getServices, getServicesByProvider } from '@/lib/api/services';
import {
  useFavoriteServiceIds,
  useFavoriteProviderIds,
  useFavoriteMutations,
} from '@/lib/hooks/useFavorites';
import { ServiceSearch } from './components/ServiceSearch';
import { ServiceFilters } from './components/ServiceFilters';
import { ServicesList } from './components/ServicesList';

/**
 * Componente interno que usa useSearchParams
 * Debe estar envuelto en Suspense para Next.js 15
 */
function ServicesPageContent(): ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer provider_id de la URL
  const providerIdParam = searchParams.get('provider');
  const providerId = providerIdParam ? Number.parseInt(providerIdParam, 10) : null;

  // Estados
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | 'all'
  >('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Resetear página cuando cambia el provider
  useEffect(() => {
    setCurrentPage(1);
  }, [providerId]);

  const limit = 12;
  const offset = (currentPage - 1) * limit;

  // Query para obtener servicios
  const {
    data: servicesResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'services',
      providerId,
      searchText,
      selectedCategory,
      selectedSort,
      currentPage,
    ],
    queryFn: async () => {
      // Si hay un provider_id en la URL, usar la ruta específica
      if (providerId && !Number.isNaN(providerId)) {
        const result = await getServicesByProvider(providerId, {
          limit,
          offset,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        return result.data;
      }

      // Si no hay provider_id, usar la ruta general con filtros
      const params: {
        search?: string;
        category?: string;
        sort_by?: string;
        page?: number;
        limit?: number;
        is_active?: boolean;
      } = {
        page: currentPage,
        limit,
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

  // Obtener IDs de proveedores favoritos
  const favoriteProviderIds = useFavoriteProviderIds();

  // Hook de mutaciones de favoritos (sin ejecutar queries innecesarias)
  const { toggleServiceFavorite, toggleProviderFavorite } =
    useFavoriteMutations();

  const handleToggleFavorite = (serviceId: number): void => {
    const isFavorite = favoriteServiceIds.includes(serviceId);
    toggleServiceFavorite(serviceId, isFavorite);
  };

  const handleToggleProviderFavorite = (providerId: number): void => {
    const isFavorite = favoriteProviderIds.includes(providerId);
    toggleProviderFavorite(providerId, isFavorite);
  };

  // Extraer servicios y metadata - ESTRUCTURA ACTUALIZADA
  const services: Service[] = servicesResponse?.data?.data || [];
  const totalResults = servicesResponse?.data?.total || 0;
  const hasResults = services.length > 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#201d12]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-[#201d12]/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center p-4 pb-2">
          <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-playfair">
            Búsqueda de Servicios
          </h1>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="px-4 py-3">
        {/* Search Bar */}
        <div className="mb-4">
          <ServiceSearch
            onSearch={handleSearch}
            placeholder="Buscar servicios o salones..."
            initialValue={searchText}
          />
        </div>

        {/* Chips Filters */}
        <ServiceFilters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedSort={selectedSort}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Results Count */}
      {!isLoading && hasResults && (
        <p className="text-neutral-300 text-sm font-normal leading-normal pb-3 pt-1 px-4 font-poppins">
          {totalResults === 1
            ? '1 resultado'
            : `${totalResults} resultados`}
        </p>
      )}

      {/* Cards Section */}
      <main className="flex flex-col gap-4 px-4 pb-6">
        <ServicesList
          services={services}
          isLoading={isLoading}
          onSelectService={handleSelectService}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteServiceIds}
          onToggleProviderFavorite={handleToggleProviderFavorite}
          favoriteProviderIds={favoriteProviderIds}
        />
      </main>

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

/**
 * Página de Catálogo de Servicios - Cliente
 * Permite buscar, filtrar y explorar servicios disponibles
 * Envuelto en Suspense para cumplir con los requisitos de Next.js 15
 */
export default function ServicesPage(): ReactNode {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#201d12]">
          <div className="px-4 py-3">
            <div className="h-14 bg-white/5 rounded-xl animate-pulse mb-4"></div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-white/5 rounded-full animate-pulse shrink-0"
                ></div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 pb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl bg-white/5 overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-video bg-white/10"></div>
                <div className="p-4">
                  <div className="h-4 bg-white/10 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="flex items-end justify-between">
                    <div className="h-4 bg-white/10 rounded w-24"></div>
                    <div className="h-4 bg-white/10 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}
