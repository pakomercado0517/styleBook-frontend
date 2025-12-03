import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getServices,
  getServiceById,
  getServicesByProvider,
  createService,
  updateService,
  deleteService,
} from '@/lib/api/services';
import type {
  CreateServiceData,
  UpdateServiceData,
} from '@/lib/types/services';
import { toast } from 'sonner';

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
 * Hook para obtener servicios de un proveedor específico
 */
export function useProviderServices(
  providerId: number | undefined,
  params?: {
    limit?: number;
    offset?: number;
    category?: string;
    is_active?: boolean;
  }
) {
  return useQuery({
    queryKey: ['provider-services', providerId, params],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }
      const result = await getServicesByProvider(providerId, {
        limit: params?.limit,
        offset: params?.offset,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!providerId,
    staleTime: 2 * 60 * 1000, // 2 minutos
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

/**
 * Hook para crear un servicio
 */
export function useCreateService(providerId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServiceData) => {
      if (!providerId) {
        throw new Error('Provider ID no disponible');
      }

      // Preparar datos para enviar a la API
      // Quitar is_active y omitir image_url si está vacío
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_active, image_url, ...serviceData } = data;
      const payload: {
        name: string;
        description: string;
        category: string;
        price: number;
        duration_minutes: number;
        image_url?: string;
      } = {
        name: serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        price: serviceData.price,
        duration_minutes: serviceData.duration_minutes,
      };

      // Solo incluir image_url si no está vacío
      if (image_url && image_url.trim() !== '') {
        payload.image_url = image_url;
      }

      // is_active se omite intencionalmente - no se envía al crear

      const result = await createService(providerId, payload);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar queries de servicios del proveedor
      queryClient.invalidateQueries({
        queryKey: ['provider-services', providerId],
      });
      queryClient.invalidateQueries({
        queryKey: ['services'],
      });
      toast.success('Servicio creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el servicio');
    },
  });
}

/**
 * Hook para actualizar un servicio
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceId,
      data,
    }: {
      serviceId: number;
      data: UpdateServiceData;
    }) => {
      const result = await updateService(serviceId, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['service', variables.serviceId],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-services'],
      });
      queryClient.invalidateQueries({
        queryKey: ['services'],
      });
      toast.success('Servicio actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el servicio');
    },
  });
}

/**
 * Hook para eliminar un servicio
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: number) => {
      const result = await deleteService(serviceId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['provider-services'],
      });
      queryClient.invalidateQueries({
        queryKey: ['services'],
      });
      toast.success('Servicio eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el servicio');
    },
  });
}
