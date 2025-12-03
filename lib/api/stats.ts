import { API_BASE_URL } from '@/lib/constants';
import type { GetProviderRatingStatsResponse } from '@/lib/types/stats';
import { getProviderAppointments } from './appointments';

/**
 * Obtiene estadísticas de rating del proveedor
 * Endpoint: GET /reviews/provider/:providerId/stats
 */
export async function getProviderRatingStats(
  providerId: number
): Promise<GetProviderRatingStatsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reviews/provider/${providerId}/stats`
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener estadísticas de rating',
      };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error fetching provider rating stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

// Re-exportar getProviderAppointments para mantener compatibilidad
export { getProviderAppointments };

