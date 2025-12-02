import type {
  Service,
  ServicesPaginatedResponse,
  GetServicesResponse,
  GetServiceResponse,
} from '@/lib/types/services';
import { API_BASE_URL } from '@/lib/constants';
import { fetchWithAuth } from '@/lib/api/interceptor';

/**
 * Obtiene lista paginada de servicios con filtros opcionales
 * @param params - Parámetros de búsqueda y filtrado
 * @returns Promise con resultado de servicios
 */
export const getServices = async (params?: {
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
}): Promise<GetServicesResponse> => {
  try {
    // Construir query params
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.min_price !== undefined)
      queryParams.append('min_price', params.min_price.toString());
    if (params?.max_price !== undefined)
      queryParams.append('max_price', params.max_price.toString());
    if (params?.provider_id)
      queryParams.append('provider_id', params.provider_id.toString());
    if (params?.city) queryParams.append('city', params.city);
    if (params?.is_active !== undefined)
      queryParams.append('is_active', params.is_active.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/services?${queryString}`
      : `${API_BASE_URL}/services`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener servicios',
      };
    }

    const data: ServicesPaginatedResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching services:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener servicios',
    };
  }
};

/**
 * Obtiene un servicio por ID
 * @param id - ID del servicio
 * @returns Promise con resultado del servicio
 */
export const getServiceById = async (
  id: number
): Promise<GetServiceResponse> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/services/${id}`);

    if (!response.ok) {
      return {
        success: false,
        error: 'Servicio no encontrado',
      };
    }

    const data: { success: true; data: Service } = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error fetching service:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener servicio',
    };
  }
};

/**
 * Obtiene servicios de un proveedor específico
 * Usa la ruta específica: /services/provider/:id
 * @param providerId - ID del proveedor
 * @param params - Parámetros adicionales de filtrado (limit, offset)
 * @returns Promise con resultado de servicios
 */
export const getServicesByProvider = async (
  providerId: number,
  params?: {
    limit?: number;
    offset?: number;
  }
): Promise<GetServicesResponse> => {
  try {
    // Construir query params
    const queryParams = new URLSearchParams();
    
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/services/provider/${providerId}?${queryString}`
      : `${API_BASE_URL}/services/provider/${providerId}`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener servicios del proveedor',
      };
    }

    const data: ServicesPaginatedResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching services by provider:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al obtener servicios del proveedor',
    };
  }
};

/**
 * Busca servicios por texto
 * @param searchText - Texto de búsqueda
 * @param params - Parámetros adicionales de filtrado
 * @returns Promise con resultado de servicios
 */
export const searchServices = async (
  searchText: string,
  params?: {
    category?: string;
    min_price?: number;
    max_price?: number;
    city?: string;
    sort_by?: string;
    page?: number;
    limit?: number;
  }
): Promise<GetServicesResponse> => {
  return getServices({
    search: searchText,
    ...params,
  });
};

/**
 * Obtiene servicios por categoría
 * @param category - Categoría del servicio
 * @param params - Parámetros adicionales de filtrado
 * @returns Promise con resultado de servicios
 */
export const getServicesByCategory = async (
  category: string,
  params?: {
    min_price?: number;
    max_price?: number;
    city?: string;
    sort_by?: string;
    page?: number;
    limit?: number;
  }
): Promise<GetServicesResponse> => {
  return getServices({
    category,
    is_active: true,
    ...params,
  });
};
