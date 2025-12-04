import { useQuery } from '@tanstack/react-query';
import { getProviders, getProviderById } from '@/lib/api/providers';

/**
 * Hook para obtener lista de proveedores
 */
export function useProviders(params?: {
  search?: string;
  business_type?: string;
  city?: string;
  min_rating?: number;
  is_active?: boolean;
  sort_by?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['providers', params],
    queryFn: async () => {
      const result = await getProviders(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener un proveedor por ID
 */
export function useProvider(id: number) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: async () => {
      const result = await getProviderById(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}






