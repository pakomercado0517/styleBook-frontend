import type {
  GetEmployeesResponse,
  GetEmployeeResponse,
  EmployeesPaginatedResponse,
} from '@/lib/types/employees';
import { API_BASE_URL } from '@/lib/constants';
import { fetchWithAuth } from '@/lib/api/interceptor';

/**
 * Obtiene lista de empleados de un proveedor
 * Endpoint: GET /employees/provider/:provider_id
 * @param providerId - ID del proveedor
 * @param params - Parámetros opcionales (limit, offset)
 * @returns Promise con resultado de empleados
 */
export const getEmployeesByProvider = async (
  providerId: number,
  params?: {
    limit?: number;
    offset?: number;
  }
): Promise<GetEmployeesResponse> => {
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
      ? `${API_BASE_URL}/employees/provider/${providerId}?${queryString}`
      : `${API_BASE_URL}/employees/provider/${providerId}`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener empleados del proveedor',
      };
    }

    const data: EmployeesPaginatedResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching employees by provider:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al obtener empleados del proveedor',
    };
  }
};

/**
 * Obtiene un empleado por ID
 * @param id - ID del empleado
 * @returns Promise con resultado del empleado
 */
export const getEmployeeById = async (
  id: number
): Promise<GetEmployeeResponse> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/employees/${id}`);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener empleado',
      };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error fetching employee:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener empleado',
    };
  }
};

