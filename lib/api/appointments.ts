import type {
  CreateAppointmentData,
  UpdateAppointmentData,
  GetAppointmentsResponse,
  GetAppointmentResponse,
  CreateAppointmentResponse,
  UpdateAppointmentResponse,
  DeleteAppointmentResponse,
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

    if (params?.limit) queryParams.append('limit', params.limit.toString());
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

    const data = await response.json();
    return { success: true, data };
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
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al crear la cita',
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
