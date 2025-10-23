import { API_BASE_URL } from '@/lib/constants';
import {
  getAuthToken,
  getRefreshToken,
  saveAuthData,
  clearAuthData,
} from '@/lib/utils/auth';
import type { Result } from '@/lib/types/common';

let isRefreshing = false;
interface QueueItem {
  resolve: (value?: string) => void;
  reject: (reason?: Error) => void;
}

let failedQueue: QueueItem[] = [];

/**
 * Procesa la cola de requests fallidos después de refresh
 */
function processQueue(error: Error | null, token?: string) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

/**
 * Cliente HTTP con manejo automático de refresh token
 */
export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<Result<T>> {
  try {
    const token = getAuthToken();

    // Headers base
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Hacer request
    let response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Si el token expiró (401)
    if (response.status === 401) {
      // Si ya estamos refreshing, poner en cola
      if (isRefreshing) {
        try {
          const newToken = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });

          // Reintentar con nuevo token
          response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        } catch {
          throw new Error('Error al renovar token');
        }
      } else {
        isRefreshing = true;

        try {
          // Intentar refresh
          const refreshToken = getRefreshToken();
          if (!refreshToken) throw new Error('No refresh token');

          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshResponse.ok) {
            throw new Error('Error al renovar token');
          }

          const refreshData = await refreshResponse.json();
          const {
            user,
            token: newToken,
            refreshToken: newRefreshToken,
          } = refreshData.data;

          // Guardar nuevos tokens
          saveAuthData(user, newToken, newRefreshToken);

          // Procesar cola con nuevo token
          processQueue(null, newToken);

          // Reintentar request original
          response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        } catch (error) {
          processQueue(error as Error);
          clearAuthData();
          throw new Error('Error al renovar token');
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Procesar respuesta
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error en la petición',
      };
    }

    return {
      success: true,
      data: data.data as T,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error desconocido',
    };
  }
}
