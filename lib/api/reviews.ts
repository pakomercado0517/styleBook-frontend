import type {
  CreateReviewData,
  UpdateReviewData,
  GetReviewResponse,
  GetProviderReviewsResponse,
  GetMyReviewsResponse,
  CreateReviewResponse,
  UpdateReviewResponse,
  DeleteReviewResponse,
  GetReviewStatsResponse,
} from '@/lib/types/reviews';

import { API_BASE_URL } from '@/lib/constants';
import { hasActiveSession } from '@/lib/api/client';
import { fetchWithAuth } from '@/lib/api/interceptor';

/**
 * Parámetros para obtener reseñas del proveedor
 */
export interface GetProviderReviewsParams {
  limit?: number;
  offset?: number;
}

/**
 * Parámetros para obtener mis reseñas (cliente)
 */
export interface GetMyReviewsParams {
  limit?: number;
  offset?: number;
}

/**
 * Crea una nueva reseña para una cita completada
 * Endpoint: POST /reviews
 * Autenticación: Requerida
 */
export async function createReview(
  data: CreateReviewData
): Promise<CreateReviewResponse> {
  try {
    if (!hasActiveSession()) {
      return { success: false, error: 'No hay sesión activa' };
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Error al crear la reseña';

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error creating review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Obtiene todas las reseñas de un proveedor (público)
 * Endpoint: GET /reviews/provider/:providerId
 * Autenticación: No requerida
 */
export async function getProviderReviews(
  providerId: number,
  params?: GetProviderReviewsParams
): Promise<GetProviderReviewsResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Validar que el límite no exceda 100 (máximo permitido por el backend)
    const limit = params?.limit ? Math.min(params.limit, 100) : undefined;
    if (limit) queryParams.append('limit', limit.toString());
    if (params?.offset !== undefined)
      queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/reviews/provider/${providerId}?${queryString}`
      : `${API_BASE_URL}/reviews/provider/${providerId}`;

    // Este endpoint es público, no requiere autenticación
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener reseñas del proveedor',
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error fetching provider reviews:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Obtiene todas mis reseñas (cliente autenticado)
 * Endpoint: GET /reviews/client/my-reviews
 * Autenticación: Requerida
 */
export async function getMyReviews(
  params?: GetMyReviewsParams
): Promise<GetMyReviewsResponse> {
  try {
    if (!hasActiveSession()) {
      return { success: false, error: 'No hay sesión activa' };
    }

    const queryParams = new URLSearchParams();

    // Validar que el límite no exceda 100
    const limit = params?.limit ? Math.min(params.limit, 100) : undefined;
    if (limit) queryParams.append('limit', limit.toString());
    if (params?.offset !== undefined)
      queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/reviews/client/my-reviews?${queryString}`
      : `${API_BASE_URL}/reviews/client/my-reviews`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return { success: false, error: 'Error al obtener mis reseñas' };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error fetching my reviews:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Obtiene una reseña específica por ID (público)
 * Endpoint: GET /reviews/:id
 * Autenticación: No requerida
 */
export async function getReview(id: number): Promise<GetReviewResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Error al obtener la reseña' };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error fetching review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Actualiza una reseña (solo el autor)
 * Endpoint: PUT /reviews/:id
 * Autenticación: Requerida
 */
export async function updateReview(
  id: number,
  data: UpdateReviewData
): Promise<UpdateReviewResponse> {
  try {
    if (!hasActiveSession()) {
      return { success: false, error: 'No hay sesión activa' };
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al actualizar la reseña',
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error updating review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Elimina una reseña (solo el autor o admin)
 * Endpoint: DELETE /reviews/:id
 * Autenticación: Requerida
 */
export async function deleteReview(id: number): Promise<DeleteReviewResponse> {
  try {
    if (!hasActiveSession()) {
      return { success: false, error: 'No hay sesión activa' };
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al eliminar la reseña',
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error deleting review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Obtiene estadísticas de rating de un proveedor (público)
 * Endpoint: GET /reviews/provider/:providerId/stats
 * Autenticación: No requerida
 */
export async function getProviderReviewStats(
  providerId: number
): Promise<GetReviewStatsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reviews/provider/${providerId}/stats`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener estadísticas de reseñas',
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}
