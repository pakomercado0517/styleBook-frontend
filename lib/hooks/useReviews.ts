import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReview,
  getProviderReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  getProviderReviewStats,
} from '@/lib/api/reviews';
import type {
  GetProviderReviewsParams,
  GetMyReviewsParams,
} from '@/lib/api/reviews';
import type { CreateReviewData, UpdateReviewData } from '@/lib/types/reviews';
import { toast } from 'sonner';

/**
 * Hook para obtener una reseña por ID
 */
export function useReview(id: number) {
  return useQuery({
    queryKey: ['review', id],
    queryFn: async () => {
      const result = await getReview(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener reseñas de un proveedor (público)
 */
export function useProviderReviews(
  providerId: number,
  params?: GetProviderReviewsParams
) {
  return useQuery({
    queryKey: ['provider-reviews', providerId, params],
    queryFn: async () => {
      const result = await getProviderReviews(providerId, params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: providerId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener mis reseñas (cliente autenticado)
 */
export function useMyReviews(params?: GetMyReviewsParams) {
  return useQuery({
    queryKey: ['my-reviews', params],
    queryFn: async () => {
      const result = await getMyReviews(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: params !== undefined, // Solo ejecutar si hay parámetros
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obtener estadísticas de rating de un proveedor (público)
 */
export function useProviderReviewStats(providerId: number) {
  return useQuery({
    queryKey: ['provider-review-stats', providerId],
    queryFn: async () => {
      const result = await getProviderReviewStats(providerId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: providerId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para crear una reseña
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData) => {
      const result = await createReview(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['provider-reviews'],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-reviews'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-review-stats'],
      });
      queryClient.invalidateQueries({
        queryKey: ['review'],
      });
      toast.success('Reseña creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la reseña');
    },
  });
}

/**
 * Hook para actualizar una reseña
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      data,
    }: {
      reviewId: number;
      data: UpdateReviewData;
    }) => {
      const result = await updateReview(reviewId, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['review', variables.reviewId],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-reviews'],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-reviews'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-review-stats'],
      });
      toast.success('Reseña actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar la reseña');
    },
  });
}

/**
 * Hook para eliminar una reseña
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {
      const result = await deleteReview(reviewId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['provider-reviews'],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-reviews'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider-review-stats'],
      });
      queryClient.invalidateQueries({
        queryKey: ['review'],
      });
      toast.success('Reseña eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar la reseña');
    },
  });
}
