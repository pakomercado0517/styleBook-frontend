'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import type { BusinessType } from '@/lib/types/provider';
import { useProviders } from '@/lib/hooks/useProviders';
import {
  useFavoriteProviderIds,
  useFavoriteMutations,
} from '@/lib/hooks/useFavorites';
import { ProviderSearch } from './components/ProviderSearch';
import { ProviderFilters } from './components/ProviderFilters';
import { ProvidersList } from './components/ProvidersList';

/**
 * Página de Catálogo de Proveedores - Cliente
 * Permite buscar, filtrar y explorar proveedores disponibles
 */
export default function ProvidersPage(): ReactNode {
  const router = useRouter();

  // Estados
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBusinessType, setSelectedBusinessType] = useState<
    BusinessType | 'all'
  >('all');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Query para obtener proveedores
  const {
    data: providersResponse,
    isLoading,
    isError,
    error,
  } = useProviders({
    search: searchText || undefined,
    business_type: selectedBusinessType !== 'all' ? selectedBusinessType : undefined,
    city: selectedCity || undefined,
    min_rating: minRating > 0 ? minRating : undefined,
    sort_by: selectedSort,
    page: currentPage,
    limit: 12,
    is_active: true,
  });

  // Handlers
  const handleSearch = (text: string): void => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const handleBusinessTypeChange = (type: BusinessType | 'all'): void => {
    setSelectedBusinessType(type);
    setCurrentPage(1);
  };

  const handleCityChange = (city: string): void => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  const handleMinRatingChange = (rating: number): void => {
    setMinRating(rating);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string): void => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handleSelectProvider = (providerId: number): void => {
    router.push(`/client/services?provider=${providerId}`);
  };

  // Obtener IDs de proveedores favoritos
  const favoriteProviderIds = useFavoriteProviderIds();

  // Hook de mutaciones de favoritos
  const { toggleProviderFavorite } = useFavoriteMutations();

  const handleToggleFavorite = (providerId: number): void => {
    const isFavorite = favoriteProviderIds.includes(providerId);
    toggleProviderFavorite(providerId, isFavorite);
  };

  // Extraer proveedores y metadata
  const providers = providersResponse?.data?.data || [];
  const totalResults = providersResponse?.data?.total || 0;
  const hasResults = providers.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
          Catálogo de Proveedores
        </h1>
        <p className="text-neutral-600 font-poppins text-base md:text-lg">
          Descubre los mejores proveedores de servicios de belleza
        </p>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <ProviderSearch
          onSearch={handleSearch}
          placeholder="Buscar por nombre o descripción..."
          initialValue={searchText}
        />
      </div>

      {/* Filtros */}
      <div className="mb-6 md:mb-8">
        <ProviderFilters
          selectedBusinessType={selectedBusinessType}
          onBusinessTypeChange={handleBusinessTypeChange}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          minRating={minRating}
          onMinRatingChange={handleMinRatingChange}
          selectedSort={selectedSort}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Contador de resultados */}
      {!isLoading && hasResults && (
        <div className="mb-4">
          <p className="text-sm text-neutral-600 font-poppins">
            {totalResults === 1
              ? '1 proveedor encontrado'
              : `${totalResults} proveedores encontrados`}
          </p>
        </div>
      )}

      {/* Lista de proveedores */}
      <ProvidersList
        providers={providers}
        isLoading={isLoading}
        onSelectProvider={handleSelectProvider}
        onToggleFavorite={handleToggleFavorite}
        favoriteIds={favoriteProviderIds}
      />

      {/* Error state */}
      {isError && !isLoading && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h3 className="font-playfair text-xl font-bold text-red-800 mb-2">
            Error al cargar proveedores
          </h3>
          <p className="text-red-600 font-poppins">
            {error instanceof Error
              ? error.message
              : 'Hubo un problema al cargar los proveedores. Por favor, intenta nuevamente.'}
          </p>
        </div>
      )}
    </div>
  );
}


