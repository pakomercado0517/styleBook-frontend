'use client';

import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { refreshAccessToken } from '@/lib/api/interceptor';

// Crear una instancia de QueryClient con retry logic personalizada
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: async (failureCount, error: any) => {
        // Si el error es 401, intentar renovar el token
        if (error?.response?.status === 401) {
          const refreshSuccess = await refreshAccessToken();
          // Si se renovó el token, reintentar la petición
          return refreshSuccess;
        }

        // Para otros errores, reintentar máximo 3 veces
        return failureCount < 3;
      },
      // Stale time de 5 minutos
      staleTime: 5 * 60 * 1000,
      // Cache time de 10 minutos
      cacheTime: 10 * 60 * 1000,
      // Refetch en focus después de 5 minutos
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false, // No reintentar mutaciones
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
