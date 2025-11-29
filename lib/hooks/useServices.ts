import { useQuery } from '@tanstack/react-query';
import { getServices, getServiceById } from '@/lib/api/services';

/**
 * Hook para obtener lista de servicios
 */
export function useServices(params?: {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  provider_id?: number;
  city?: string;
  is_active?: boolean;
  sort_by?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: async () => {
      const result = await getServices(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

/**
 * Hook para obtener un servicio por ID
 */
export function useService(id: number) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const result = await getServiceById(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id && !isNaN(id),
  });
}
