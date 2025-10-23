import type { Result, ApiResponse } from '@/lib/types/common';
import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';

/**
 * Cliente HTTP base para todas las llamadas a la API
 * Maneja autenticación, headers y errores de forma centralizada
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<Result<T>> {
  try {
    // Obtener token de localStorage si existe
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        : undefined;

    // Construir headers con autenticación si hay token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Agregar headers adicionales si existen
    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      });
    }

    // Hacer la petición HTTP
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parsear respuesta JSON
    const data: ApiResponse<T> = await response.json();

    // Si la respuesta no es exitosa, retornar error con todos los detalles
    if (!response.ok || data.success === false) {
      // Construir mensaje de error detallado
      let errorMessage = data.message || 'Error en la petición';

      // Si hay errores de validación (array), formatear como lista
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        // Usar saltos de línea para separar cada error
        const validationMessages = data.errors
          .map((error, index) => `${index + 1}. ${error.message}`)
          .join('\n');

        errorMessage = validationMessages;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    // Retornar datos exitosamente
    return {
      success: true,
      data: data.data as T,
    };
  } catch (error) {
    // Capturar errores de red u otros errores inesperados
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error de conexión con el servidor',
    };
  }
}

/**
 * Helper para hacer peticiones GET
 */
export async function get<T>(
  endpoint: string,
  options?: RequestInit
): Promise<Result<T>> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * Helper para hacer peticiones POST
 */
export async function post<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<Result<T>> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Helper para hacer peticiones PUT
 */
export async function put<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<Result<T>> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Helper para hacer peticiones DELETE
 */
export async function del<T>(
  endpoint: string,
  options?: RequestInit
): Promise<Result<T>> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}
