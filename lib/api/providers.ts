import type {
  ProvidersPaginatedResponse,
  GetProvidersResponse,
  GetProviderProfileResponse,
} from '@/lib/types/provider';
import { API_BASE_URL } from '@/lib/constants';
import { fetchWithAuth } from '@/lib/api/interceptor';

/**
 * Obtiene lista paginada de proveedores con filtros opcionales
 * @param params - Parámetros de búsqueda y filtrado
 * @returns Promise con resultado de proveedores
 */
export const getProviders = async (params?: {
  search?: string;
  business_type?: string;
  city?: string;
  min_rating?: number;
  is_active?: boolean;
  sort_by?: string;
  page?: number;
  limit?: number;
}): Promise<GetProvidersResponse> => {
  try {
    // Construir query params
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.business_type)
      queryParams.append('business_type', params.business_type);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.min_rating !== undefined)
      queryParams.append('min_rating', params.min_rating.toString());
    if (params?.is_active !== undefined)
      queryParams.append('is_active', params.is_active.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/providers?${queryString}`
      : `${API_BASE_URL}/providers`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener proveedores',
      };
    }

    const data: ProvidersPaginatedResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching providers:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener proveedores',
    };
  }
};

/**
 * Obtiene un proveedor por ID
 * @param id - ID del proveedor
 * @returns Promise con resultado del proveedor
 */
export const getProviderById = async (
  id: number
): Promise<GetProviderProfileResponse> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/providers/${id}`);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener proveedor',
      };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error fetching provider:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener proveedor',
    };
  }
};

/**
 * Actualiza el perfil de un proveedor
 * @param id - ID del proveedor
 * @param data - Datos a actualizar
 * @returns Promise con resultado de la actualización
 */
export const updateProviderProfile = async (
  id: number,
  data: import('@/lib/types/provider').UpdateProviderProfileData
): Promise<import('@/lib/types/provider').UpdateProviderProfileResponse> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/providers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Error al actualizar el perfil';
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
    console.error('Error updating provider profile:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar el perfil',
    };
  }
};




