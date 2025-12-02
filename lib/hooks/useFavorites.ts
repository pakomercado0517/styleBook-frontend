'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getFavorites,
  getProviderFavorites,
  getServiceFavorites,
  addServiceToFavorites,
  addProviderToFavorites,
  deleteServiceFromFavorites,
  deleteProviderFromFavorites,
  isServiceFavorite,
  isProviderFavorite,
} from '@/lib/api/favorites';
import type { Favorite } from '@/lib/types/favorites';

type FilterType = 'all' | 'providers' | 'services';

interface UseFavoritesOptions {
  filter?: FilterType;
  limit?: number;
  offset?: number;
}

/**
 * Hook personalizado para manejar favoritos
 * Proporciona funciones para agregar, eliminar y verificar favoritos
 */
export function useFavorites(options: UseFavoritesOptions = {}) {
  const { filter = 'all', limit = 20, offset = 0 } = options;
  const queryClient = useQueryClient();

  // Query para obtener favoritos según el filtro
  const favoritesQuery = useQuery({
    queryKey: ['favorites', filter, limit, offset],
    queryFn: async () => {
      if (filter === 'providers') {
        const result = await getProviderFavorites(limit, offset);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      }

      if (filter === 'services') {
        const result = await getServiceFavorites(limit, offset);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      }

      // filter === 'all'
      const result = await getFavorites(limit, offset);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Mutación para agregar servicio a favoritos
  const addServiceMutation = useMutation({
    mutationFn: (serviceId: number) => addServiceToFavorites(serviceId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Servicio agregado a favoritos');
        // Invalidar todas las queries de favoritos
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
        // Invalidar explícitamente el query de IDs de servicios favoritos
        queryClient.invalidateQueries({
          queryKey: ['favorites', 'services', 'ids'],
        });
      } else {
        toast.error(result.error || 'Error al agregar a favoritos');
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  // Mutación para eliminar servicio de favoritos
  const removeServiceMutation = useMutation({
    mutationFn: (serviceId: number) => deleteServiceFromFavorites(serviceId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Servicio eliminado de favoritos');
        // Invalidar todas las queries de favoritos
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
        // Invalidar explícitamente el query de IDs de servicios favoritos
        queryClient.invalidateQueries({
          queryKey: ['favorites', 'services', 'ids'],
        });
      } else {
        toast.error(result.error || 'Error al eliminar de favoritos');
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  // Mutación para agregar proveedor a favoritos
  const addProviderMutation = useMutation({
    mutationFn: (providerId: number) => addProviderToFavorites(providerId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Proveedor agregado a favoritos');
        // Invalidar todas las queries de favoritos
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
      } else {
        toast.error(result.error || 'Error al agregar a favoritos');
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  // Mutación para eliminar proveedor de favoritos
  const removeProviderMutation = useMutation({
    mutationFn: (providerId: number) => deleteProviderFromFavorites(providerId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Proveedor eliminado de favoritos');
        // Invalidar todas las queries de favoritos
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
      } else {
        toast.error(result.error || 'Error al eliminar de favoritos');
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  // Función para toggle de servicio
  const toggleServiceFavorite = (
    serviceId: number,
    isFavorite: boolean
  ): void => {
    if (isFavorite) {
      removeServiceMutation.mutate(serviceId);
    } else {
      addServiceMutation.mutate(serviceId);
    }
  };

  // Función para toggle de proveedor
  const toggleProviderFavorite = (
    providerId: number,
    isFavorite: boolean
  ): void => {
    if (isFavorite) {
      removeProviderMutation.mutate(providerId);
    } else {
      addProviderMutation.mutate(providerId);
    }
  };

  // Extraer datos según el tipo de filtro
  const data = favoritesQuery.data;
  let favorites: Favorite[] = [];
  let total = 0;
  let providerFavorites = 0;
  let serviceFavorites = 0;

  if (data) {
    if (filter === 'all') {
      // Cuando filter === 'all', data es FavoritesPaginatedResponse
      const allData = data as {
        favorites?: Favorite[];
        total?: number;
        provider_favorites?: number;
        service_favorites?: number;
      };
      favorites = allData.favorites || [];
      total = allData.total || 0;
      providerFavorites = allData.provider_favorites || 0;
      serviceFavorites = allData.service_favorites || 0;
    } else if (filter === 'providers') {
      // Cuando filter === 'providers', data es { providers: Favorite[], total: number }
      const providersData = data as {
        providers?: Favorite[];
        total?: number;
      };
      favorites = providersData.providers || [];
      total = providersData.total || 0;
    } else if (filter === 'services') {
      // Cuando filter === 'services', data es { services: Favorite[], total: number }
      const servicesData = data as {
        services?: Favorite[];
        total?: number;
      };
      favorites = servicesData.services || [];
      total = servicesData.total || 0;
    }
  }

  return {
    // Datos
    favorites,
    total,
    providerFavorites,
    serviceFavorites,
    // Estados
    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,
    error: favoritesQuery.error,
    // Funciones
    toggleServiceFavorite,
    toggleProviderFavorite,
    // Estados de mutaciones
    isAddingService: addServiceMutation.isPending,
    isRemovingService: removeServiceMutation.isPending,
    isAddingProvider: addProviderMutation.isPending,
    isRemovingProvider: removeProviderMutation.isPending,
  };
}

/**
 * Hook para verificar si un servicio es favorito
 */
export function useIsServiceFavorite(serviceId: number | undefined) {
  return useQuery({
    queryKey: ['isFavorite', 'service', serviceId],
    queryFn: async () => {
      if (!serviceId) {
        return false;
      }
      const result = await isServiceFavorite(serviceId);
      if (!result.success) {
        return false;
      }
      return result.data.is_favorite;
    },
    enabled: serviceId !== undefined,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para verificar si un proveedor es favorito
 */
export function useIsProviderFavorite(providerId: number | undefined) {
  return useQuery({
    queryKey: ['isFavorite', 'provider', providerId],
    queryFn: async () => {
      if (!providerId) {
        return false;
      }
      const result = await isProviderFavorite(providerId);
      if (!result.success) {
        return false;
      }
      return result.data.is_favorite;
    },
    enabled: providerId !== undefined,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para mutaciones de favoritos (sin ejecutar queries)
 * Útil cuando solo necesitas las funciones de toggle sin cargar datos
 */
export function useFavoriteMutations() {
  const queryClient = useQueryClient();

  // Mutación para agregar servicio a favoritos
  const addServiceMutation = useMutation({
    mutationFn: (serviceId: number) => addServiceToFavorites(serviceId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Servicio agregado a favoritos');
        // Invalidar todas las queries de favoritos
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
        // Invalidar explícitamente el query de IDs de servicios favoritos
        queryClient.invalidateQueries({
          queryKey: ['favorites', 'services', 'ids'],
        });
      } else {
        toast.error(result.error || 'Error al agregar a favoritos');
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  // Mutación para eliminar servicio de favoritos
  const removeServiceMutation = useMutation({
    mutationFn: (serviceId: number) => deleteServiceFromFavorites(serviceId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Servicio eliminado de favoritos');
        // Invalidar todas las queries de favoritos
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
        // Invalidar explícitamente el query de IDs de servicios favoritos
        queryClient.invalidateQueries({
          queryKey: ['favorites', 'services', 'ids'],
        });
      } else {
        toast.error(result.error || 'Error al eliminar de favoritos');
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  // Mutación para agregar proveedor a favoritos
  const addProviderMutation = useMutation({
    mutationFn: (providerId: number) => addProviderToFavorites(providerId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Proveedor agregado a favoritos');
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
      } else {
        toast.error(result.error || 'Error al agregar a favoritos');
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  // Mutación para eliminar proveedor de favoritos
  const removeProviderMutation = useMutation({
    mutationFn: (providerId: number) => deleteProviderFromFavorites(providerId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Proveedor eliminado de favoritos');
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        queryClient.invalidateQueries({ queryKey: ['isFavorite'] });
      } else {
        toast.error(result.error || 'Error al eliminar de favoritos');
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error de conexión';
      toast.error(message);
    },
  });

  // Función para toggle de servicio
  const toggleServiceFavorite = (
    serviceId: number,
    isFavorite: boolean
  ): void => {
    if (isFavorite) {
      removeServiceMutation.mutate(serviceId);
    } else {
      addServiceMutation.mutate(serviceId);
    }
  };

  // Función para toggle de proveedor
  const toggleProviderFavorite = (
    providerId: number,
    isFavorite: boolean
  ): void => {
    if (isFavorite) {
      removeProviderMutation.mutate(providerId);
    } else {
      addProviderMutation.mutate(providerId);
    }
  };

  return {
    toggleServiceFavorite,
    toggleProviderFavorite,
    isAddingService: addServiceMutation.isPending,
    isRemovingService: removeServiceMutation.isPending,
    isAddingProvider: addProviderMutation.isPending,
    isRemovingProvider: removeProviderMutation.isPending,
  };
}

/**
 * Hook para obtener IDs de servicios favoritos (útil para verificar múltiples servicios)
 * Obtiene todos los favoritos usando paginación si es necesario
 */
export function useFavoriteServiceIds() {
  const { data } = useQuery({
    queryKey: ['favorites', 'services', 'ids'],
    queryFn: async () => {
      const allFavoriteIds: number[] = [];
      const limit = 100; // Tamaño de página razonable
      let offset = 0;
      let hasMore = true;

      // Obtener todos los favoritos usando paginación
      while (hasMore) {
        const result = await getServiceFavorites(limit, offset);

        if (!result.success || !result.data) {
          break;
        }

        // Ahora result.data tiene directamente { services: [], total: 0 }
        const responseData = result.data as {
          services?: Favorite[];
          total?: number;
        };

        if (!responseData.services) {
          break;
        }

        const serviceIds = responseData.services
          .map((favorite: Favorite) => favorite.service_id)
          .filter((id): id is number => id !== undefined);

        allFavoriteIds.push(...serviceIds);

        // Si obtuvimos menos de lo solicitado, no hay más páginas
        hasMore = serviceIds.length === limit;
        offset += limit;
      }

      return allFavoriteIds;
    },
    staleTime: 0, // Siempre considerar datos frescos para reflejar cambios inmediatos
  });

  return data || [];
}

/**
 * Hook para obtener IDs de proveedores favoritos (útil para verificar múltiples proveedores)
 * Obtiene todos los favoritos usando paginación si es necesario
 */
export function useFavoriteProviderIds() {
  const { data } = useQuery({
    queryKey: ['favorites', 'providers', 'ids'],
    queryFn: async () => {
      const allFavoriteIds: number[] = [];
      const limit = 100; // Tamaño de página razonable
      let offset = 0;
      let hasMore = true;

      // Obtener todos los favoritos usando paginación
      while (hasMore) {
        const result = await getProviderFavorites(limit, offset);

        if (!result.success || !result.data) {
          break;
        }

        // result.data tiene directamente { providers: [], total: 0 }
        const responseData = result.data as {
          providers?: Favorite[];
          total?: number;
        };

        if (!responseData.providers) {
          break;
        }

        const providerIds = responseData.providers
          .map((favorite: Favorite) => favorite.provider_id)
          .filter((id): id is number => id !== undefined);

        allFavoriteIds.push(...providerIds);

        // Si obtuvimos menos de lo solicitado, no hay más páginas
        hasMore = providerIds.length === limit;
        offset += limit;
      }

      return allFavoriteIds;
    },
    staleTime: 0, // Siempre considerar datos frescos para reflejar cambios inmediatos
  });

  return data || [];
}
