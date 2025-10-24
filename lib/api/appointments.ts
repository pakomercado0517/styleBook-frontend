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
import { getAuthHeaders, hasActiveSession } from '@/lib/api/client';
import { fetchWithAuth } from '@/lib/api/interceptor';

/**
 * Obtiene todas las citas del usuario autenticado
 */
export async function getAppointments(
  limit = 10,
  offset = 0
): Promise<GetAppointmentsResponse> {
  try {
    if (!hasActiveSession()) {
      return { success: false, error: 'No hay sesión activa' };
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/appointments?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      return { success: false, error: 'Error al obtener citas' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
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
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Error al obtener la cita' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
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
    const response = await fetch(`${API_BASE_URL}/appointments`, {
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
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
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
    return { success: false, error: 'Error de red' };
  }
}
