import type {
  GetEmployeesResponse,
  GetEmployeeResponse,
  EmployeesPaginatedResponse,
  CreateEmployeeResponse,
  UpdateEmployeeResponse,
  DeleteEmployeeResponse,
  CreateEmployeeData,
  UpdateEmployeeData,
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
 * Endpoint: GET /employees/:id
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

/**
 * Obtiene lista paginada de todos los empleados con filtros opcionales
 * Endpoint: GET /employees
 * @param params - Parámetros opcionales (limit, offset, provider_id)
 * @returns Promise con resultado de empleados
 */
export const getAllEmployees = async (params?: {
  limit?: number;
  offset?: number;
  provider_id?: number;
}): Promise<GetEmployeesResponse> => {
  try {
    // Construir query params
    const queryParams = new URLSearchParams();

    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params?.provider_id !== undefined) {
      queryParams.append('provider_id', params.provider_id.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/employees?${queryString}`
      : `${API_BASE_URL}/employees`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener empleados',
      };
    }

    const data: EmployeesPaginatedResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener empleados',
    };
  }
};

/**
 * Crea un nuevo empleado para un proveedor
 * Endpoint: POST /employees
 * @param data - Datos del empleado a crear
 * @returns Promise con resultado del empleado creado
 */
export const createEmployee = async (
  data: CreateEmployeeData
): Promise<CreateEmployeeResponse> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message ||
          errorData.error ||
          'Error al crear el empleado',
      };
    }

    const result: { success: true; data: import('@/lib/types/employees').Employee } =
      await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error creating employee:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear el empleado',
    };
  }
};

/**
 * Actualiza información de un empleado existente
 * Endpoint: PUT /employees/:id
 * @param id - ID del empleado
 * @param data - Datos a actualizar (todos opcionales)
 * @returns Promise con resultado del empleado actualizado
 */
export const updateEmployee = async (
  id: number,
  data: UpdateEmployeeData
): Promise<UpdateEmployeeResponse> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message ||
          errorData.error ||
          'Error al actualizar el empleado',
      };
    }

    const result: { success: true; data: import('@/lib/types/employees').Employee } =
      await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error updating employee:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar el empleado',
    };
  }
};

/**
 * Elimina un empleado del sistema
 * Endpoint: DELETE /employees/:id
 * @param id - ID del empleado a eliminar
 * @returns Promise con resultado de la eliminación
 */
export const deleteEmployee = async (
  id: number
): Promise<DeleteEmployeeResponse> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message ||
          errorData.error ||
          'Error al eliminar el empleado',
      };
    }

    const result: { success: true; data: { message: string } } =
      await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al eliminar el empleado',
    };
  }
};

