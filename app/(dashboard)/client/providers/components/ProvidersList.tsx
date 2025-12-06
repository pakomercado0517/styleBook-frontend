'use client';

import type { ReactNode } from 'react';
import type { ProviderProfile } from '@/lib/types/provider';
import { ProviderCard } from './ProviderCard';

interface ProvidersListProps {
  providers: ProviderProfile[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}

/**
 * ProvidersList - Lista de proveedores
 * Muestra proveedores en cards verticales
 */
export const ProvidersList = ({
  providers,
  isLoading = false,
  isError = false,
  error,
}: ProvidersListProps): ReactNode => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl overflow-hidden animate-pulse border border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg" />
              </div>
              <div className="h-6 bg-white/10 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
              <div className="h-4 bg-white/10 rounded w-1/3 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error al cargar los proveedores';

    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400 font-poppins">{errorMessage}</p>
      </div>
    );
  }

  // Empty state
  if (providers.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl">🔍</span>
          <p className="text-neutral-300 text-lg font-poppins">
            No se encontraron proveedores
          </p>
        </div>
      </div>
    );
  }

  // Lista de proveedores
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
};
