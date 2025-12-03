import type {
  GetEmployeeAvailabilityResponse,
  GetProviderAvailabilityResponse,
  EmployeeAvailabilityResponse,
  ProviderAvailabilityResponse,
} from '@/lib/types/availability';
import { API_BASE_URL } from '@/lib/constants';
import { fetchWithAuth } from '@/lib/api/interceptor';

/**
 * Obtiene slots disponibles de un empleado específico
 * Endpoint: GET /availability/employee/:id
 * @param employeeId - ID del empleado
 * @param params - Parámetros requeridos (service_id, date, timezone)
 * @returns Promise con resultado de disponibilidad
 */
export const getAvailabilityByEmployee = async (
  employeeId: number,
  params: {
    service_id: number;
    date: string; // YYYY-MM-DD
    timezone: string; // ej: "America/Mexico_City"
  }
): Promise<GetEmployeeAvailabilityResponse> => {
  try {
    // Construir query params
    const queryParams = new URLSearchParams();
    queryParams.append('service_id', params.service_id.toString());
    queryParams.append('date', params.date);
    queryParams.append('timezone', params.timezone);

    const url = `${API_BASE_URL}/availability/employee/${employeeId}?${queryParams.toString()}`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener disponibilidad del empleado',
      };
    }

    const data: EmployeeAvailabilityResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching availability by employee:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al obtener disponibilidad del empleado',
    };
  }
};

/**
 * Obtiene slots disponibles de todos los empleados de un proveedor
 * Endpoint: GET /availability/provider/:id
 * @param providerId - ID del proveedor
 * @param params - Parámetros requeridos (service_id, date, timezone)
 * @returns Promise con resultado de disponibilidad
 */
export const getAvailabilityByProvider = async (
  providerId: number,
  params: {
    service_id: number;
    date: string; // YYYY-MM-DD
    timezone: string; // ej: "America/Mexico_City"
  }
): Promise<GetProviderAvailabilityResponse> => {
  try {
    // Construir query params
    const queryParams = new URLSearchParams();
    queryParams.append('service_id', params.service_id.toString());
    queryParams.append('date', params.date);
    queryParams.append('timezone', params.timezone);

    const url = `${API_BASE_URL}/availability/provider/${providerId}?${queryParams.toString()}`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener disponibilidad del proveedor',
      };
    }

    const data: ProviderAvailabilityResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching availability by provider:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al obtener disponibilidad del proveedor',
    };
  }
};

