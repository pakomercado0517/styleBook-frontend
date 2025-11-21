'use client';

import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isAuthError } from '@/lib/utils/authErrorHandler';

/**
 * Crear instancia de QueryClient con manejo de errores 401
 * IMPORTANTE: NO reintenta en errores 401 porque fetchWithAuth ya maneja refresh
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // NO reintentar si es error 401 (ya manejado por fetchWithAuth)
        if (isAuthError(error)) {
          return false;
        }

        // Para otros errores, reintentar máximo 3 veces
        return failureCount < 3;
      },
      // Stale time de 5 minutos
      staleTime: 5 * 60 * 1000,
      // Cache time de 10 minutos (deprecated en v5, usar gcTime)
      gcTime: 10 * 60 * 1000,
      // Refetch en focus después de 5 minutos
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (_failureCount, error) => {
        // NO reintentar mutaciones si es error 401
        if (isAuthError(error)) {
          return false;
        }
        // No reintentar otras mutaciones
        return false;
      },
    },
  },
});

/**
 * Proveedor de React Query con configuración personalizada
 */
export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
