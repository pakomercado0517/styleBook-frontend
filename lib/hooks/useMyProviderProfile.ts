import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { getProviders } from '@/lib/api/providers';

/**
 * Hook para obtener el perfil del proveedor del usuario autenticado
 */
export function useMyProviderProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-provider-profile', user?.id],
    queryFn: async () => {
      if (!user || user.role !== 'provider') {
        return null;
      }
      // Buscar el proveedor por user_id
      const result = await getProviders({ limit: 1000 });
      if (!result.success) {
        throw new Error(result.error);
      }
      // Encontrar el proveedor que corresponde al usuario autenticado
      const provider = result.data?.data?.data?.find(
        (p) => p.user_id === user.id
      );
      return provider || null;
    },
    enabled: !!user && user.role === 'provider',
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

