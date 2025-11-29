import type {
  GetFavoritesResponse,
  GetProviderFavoritesResponse,
  GetServiceFavoritesResponse,
  AddFavoriteResponse,
  DeleteFavoriteResponse,
  IsFavoriteCheckResponse,
} from '@/lib/types/favorites';

import { API_BASE_URL } from '@/lib/constants';
import { fetchWithAuth } from '@/lib/api/interceptor';

/**
 * Obtiene todos los favoritos del usuario
 */
export async function getFavorites(
  limit = 20,
  offset = 0
): Promise<GetFavoritesResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      return { success: false, error: 'Error al obtener favoritos' };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Obtiene solo los proveedores favoritos
 */
export async function getProviderFavorites(
  limit = 20,
  offset = 0
): Promise<GetProviderFavoritesResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites/providers?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener proveedores favoritos',
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Obtiene solo los servicios favoritos
 */
export async function getServiceFavorites(
  limit: number,
  offset: number
): Promise<GetServiceFavoritesResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites/services?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      return { success: false, error: 'Error al obtener servicios favoritos' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Agrega un proveedor a favoritos
 */
export async function addProviderToFavorites(
  providerId: number
): Promise<AddFavoriteResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites/provider/${providerId}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al agregar proveedor a favoritos',
      };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Agrega un servicio a favoritos
 */
export async function addServiceToFavorites(
  serviceId: number
): Promise<AddFavoriteResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites/service/${serviceId}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al agregar servicio a favoritos',
      };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Verifica si un proveedor está en favoritos
 */
export async function isProviderFavorite(
  providerId: number
): Promise<IsFavoriteCheckResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites/provider/${providerId}/is-favorite`
    );

    if (!response.ok) {
      return { success: false, error: 'Error al verificar favorito' };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Verifica si un servicio está en favoritos
 */
export async function isServiceFavorite(
  serviceId: number
): Promise<IsFavoriteCheckResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites/service/${serviceId}/is-favorite`
    );

    if (!response.ok) {
      return { success: false, error: 'Error al verificar favorito' };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Elimina un favorito por ID
 */
export async function deleteFavorite(
  id: number
): Promise<DeleteFavoriteResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/favorites/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al eliminar favorito',
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Elimina un proveedor de favoritos
 */
export async function deleteProviderFromFavorites(
  providerId: number
): Promise<DeleteFavoriteResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites/provider/${providerId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al eliminar proveedor de favoritos',
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Elimina un servicio de favoritos
 */
export async function deleteServiceFromFavorites(
  serviceId: number
): Promise<DeleteFavoriteResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/favorites/service/${serviceId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al eliminar servicio de favoritos',
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}
