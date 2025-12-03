import type {
  CreateAppointmentData,
  UpdateAppointmentData,
  RescheduleAppointmentData,
  GetAppointmentsResponse,
  GetAppointmentResponse,
  CreateAppointmentResponse,
  UpdateAppointmentResponse,
  RescheduleAppointmentResponse,
  DeleteAppointmentResponse,
  AppointmentsPaginatedResponse,
} from '@/lib/types/appointments';

import { API_BASE_URL } from '@/lib/constants';
import { hasActiveSession } from '@/lib/api/client';
import { fetchWithAuth } from '@/lib/api/interceptor';

/**
 * Parámetros para filtrar citas
 */
export interface GetAppointmentsParams {
  limit?: number;
  offset?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  include?: string; // Para incluir relaciones: "service,employee,provider"
}

/**
 * Obtiene todas las citas del usuario autenticado con filtros opcionales
 */
export async function getAppointments(
  params?: GetAppointmentsParams
): Promise<GetAppointmentsResponse> {
  try {
    if (!hasActiveSession()) {
      return { success: false, error: 'No hay sesión activa' };
    }

    // Construir query params
    const queryParams = new URLSearchParams();

    // Validar que el límite no exceda 100 (máximo permitido por el backend)
    const limit = params?.limit ? Math.min(params.limit, 100) : undefined;
    if (limit) queryParams.append('limit', limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    // Incluir relaciones por defecto
    if (params?.include) {
      queryParams.append('include', params.include);
    } else {
      queryParams.append('include', 'service,employee,provider');
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/appointments?${queryString}`
      : `${API_BASE_URL}/appointments`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return { success: false, error: 'Error al obtener citas' };
    }

    const responseData = await response.json();
    // El backend retorna { success: true, data: { total, count, data: [...] } }
    // Necesitamos convertir a AppointmentsPaginatedResponse
    const backendData = responseData.data;
    const appointmentsData: AppointmentsPaginatedResponse = {
      success: true,
      message: responseData.message || 'Citas obtenidas',
      data: {
        appointments: backendData.data || [],
        pagination: {
          page: params?.page || Math.floor((backendData.offset || 0) / (params?.limit || backendData.limit || 20)) + 1,
          limit: params?.limit || backendData.limit || 20,
          total: backendData.total || 0,
          pages: Math.ceil((backendData.total || 0) / (params?.limit || backendData.limit || 20)),
        },
      },
      timestamp: responseData.timestamp || new Date().toISOString(),
    };
    return { success: true, data: appointmentsData };
  } catch (error) {
    console.log('error', error);
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Obtiene una cita específica por ID
 */
export async function getAppointment(
  id: number
): Promise<GetAppointmentResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/appointments/${id}`);

    if (!response.ok) {
      return { success: false, error: 'Error al obtener la cita' };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.log('error', error);
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Crea una nueva cita
 * - Las fechas deben estar en timezone local
 * - El backend se encarga de convertir a UTC
 */
export async function createAppointment(
  data: CreateAppointmentData
): Promise<CreateAppointmentResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Error al crear la cita';
      let errorCode: number | undefined;

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
        errorCode = response.status;
      } catch {
        // Si no se puede parsear el JSON, usar el status text
        errorMessage = response.statusText || errorMessage;
        errorCode = response.status;
      }

      return {
        success: false,
        error: errorMessage,
        errorCode,
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Actualiza una cita existente
 * - Solo se puede actualizar status y notas
 */
export async function updateAppointment(
  id: number,
  data: UpdateAppointmentData
): Promise<UpdateAppointmentResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/appointments/${id}`, {
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
        error: error.message || 'Error al actualizar la cita',
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.log('error', error);
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Reagenda una cita
 * Endpoint: PUT /appointments/:id/reschedule
 * - Permite cambiar fecha/hora y opcionalmente el empleado
 * - Si la cita estaba "confirmed", vuelve a "pending"
 */
export async function rescheduleAppointment(
  id: number,
  data: RescheduleAppointmentData
): Promise<RescheduleAppointmentResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/appointments/${id}/reschedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Error al reagendar la cita';
      let errorCode: number | undefined;

      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
        errorCode = response.status;
      } catch {
        errorMessage = response.statusText || errorMessage;
        errorCode = response.status;
      }

      return {
        success: false,
        error: errorMessage,
        errorCode,
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Cancela una cita
 */
export async function cancelAppointment(
  id: number
): Promise<DeleteAppointmentResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al cancelar la cita',
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.log('error', error);
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Obtiene todas las citas del proveedor autenticado
 * Endpoint: GET /appointments/provider/all
 * Permite filtrar por estado, fecha, empleado y paginación
 */
export async function getProviderAppointments(params?: {
  status?: string;
  start_date?: string;
  end_date?: string;
  employee_id?: number;
  limit?: number;
  offset?: number;
}): Promise<GetAppointmentsResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.employee_id) queryParams.append('employee_id', params.employee_id.toString());
    // Validar que el límite no exceda 100 (máximo permitido por el backend)
    const limit = params?.limit ? Math.min(params.limit, 100) : undefined;
    if (limit) queryParams.append('limit', limit.toString());
    if (params?.offset !== undefined) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/appointments/provider/all?${queryString}`
      : `${API_BASE_URL}/appointments/provider/all`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return { success: false, error: 'Error al obtener citas del proveedor' };
    }

    const responseData = await response.json();
    // El backend retorna { success: true, data: { appointments: [...], total: number } }
    // Necesitamos convertir a AppointmentsPaginatedResponse
    const backendData = responseData.data;
    const effectiveLimit = params?.limit ? Math.min(params.limit, 100) : 20;
    const effectiveOffset = params?.offset || 0;
    const total = backendData.total || 0;
    
    const appointmentsData: import('@/lib/types/appointments').AppointmentsPaginatedResponse = {
      success: true,
      message: responseData.message || 'Citas obtenidas',
      data: {
        appointments: backendData.appointments || [],
        pagination: {
          page: Math.floor(effectiveOffset / effectiveLimit) + 1,
          limit: effectiveLimit,
          total: total,
          pages: Math.ceil(total / effectiveLimit),
        },
      },
      timestamp: responseData.timestamp || new Date().toISOString(),
    };
    return { success: true, data: appointmentsData };
  } catch (error) {
    console.error('Error fetching provider appointments:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

/**
 * Obtiene las citas pendientes del proveedor autenticado
 * Endpoint: GET /appointments/provider/pending
 * Acepta limit, offset y employee_id (no acepta status porque siempre es "pending")
 */
export async function getProviderPendingAppointments(params?: {
  employee_id?: number;
  limit?: number;
  offset?: number;
}): Promise<GetAppointmentsResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.employee_id) queryParams.append('employee_id', params.employee_id.toString());
    // Validar que el límite no exceda 100 (máximo permitido por el backend)
    const limit = params?.limit ? Math.min(params.limit, 100) : undefined;
    if (limit) queryParams.append('limit', limit.toString());
    if (params?.offset !== undefined) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/appointments/provider/pending?${queryString}`
      : `${API_BASE_URL}/appointments/provider/pending`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al obtener citas pendientes del proveedor',
      };
    }

    const responseData = await response.json();
    // El backend retorna { success: true, data: { appointments: [...], total: number } }
    // Necesitamos convertir a AppointmentsPaginatedResponse
    const backendData = responseData.data;
    const effectiveLimit = params?.limit ? Math.min(params.limit, 100) : 20;
    const effectiveOffset = params?.offset || 0;
    const total = backendData.total || 0;
    
    const appointmentsData: import('@/lib/types/appointments').AppointmentsPaginatedResponse = {
      success: true,
      message: responseData.message || 'Citas pendientes obtenidas',
      data: {
        appointments: backendData.appointments || [],
        pagination: {
          page: Math.floor(effectiveOffset / effectiveLimit) + 1,
          limit: effectiveLimit,
          total: total,
          pages: Math.ceil(total / effectiveLimit),
        },
      },
      timestamp: responseData.timestamp || new Date().toISOString(),
    };
    return { success: true, data: appointmentsData };
  } catch (error) {
    console.error('Error fetching provider pending appointments:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}
