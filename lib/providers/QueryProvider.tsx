'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { CACHE_TIME } from '@/lib/constants';

/**
 * Provider de React Query
 * Configura el cliente de React Query para toda la aplicación
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Crear instancia de QueryClient (solo una vez)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tiempo que los datos se consideran "frescos" (no refetch automático)
            staleTime: CACHE_TIME.MEDIUM, // 5 minutos

            // Tiempo que los datos se mantienen en cache
            gcTime: CACHE_TIME.LONG, // 30 minutos (antes era cacheTime)

            // Reintentos en caso de error
            retry: 1,

            // No refetch automático cuando la ventana recupera el foco
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
