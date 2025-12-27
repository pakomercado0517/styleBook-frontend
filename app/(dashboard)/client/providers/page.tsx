'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { useProviders } from '@/lib/hooks/useProviders';
import { ProvidersList } from './components/ProvidersList';

/**
 * Página de Proveedores - Cliente
 * Diseño mobile-first con búsqueda y lista de proveedores
 */
export default function ProvidersPage(): ReactNode {
  const [searchText, setSearchText] = useState<string>('');

  // Query para obtener proveedores
  const {
    data: providersResponse,
    isLoading,
    isError,
    error,
  } = useProviders({
    search: searchText || undefined,
    is_active: true,
    limit: 50,
  });

  const providers = providersResponse?.data?.data || [];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Mobile Header */}
      <div className="md:hidden px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white font-playfair">Proveedores</h1>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Filtros"
            type="button"
          >
            <Filter className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
        </div>

        {/* Barra de búsqueda - Mobile */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-neutral-400" strokeWidth={2} />
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar servicios, proveedores..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
            aria-label="Buscar servicios y proveedores"
          />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white font-playfair">Proveedores</h1>
        <div className="flex items-center gap-4 flex-1 max-w-md ml-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" strokeWidth={2} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Busca"
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 font-poppins focus:outline-none focus:border-accent-500 transition-colors"
              aria-label="Buscar proveedores"
            />
          </div>
        </div>
      </div>

      {/* Lista de Proveedores */}
      <div className="px-4 md:px-8 pb-6 md:py-6">
        <ProvidersList
          providers={providers}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  );
}
