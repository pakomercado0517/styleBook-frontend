import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';

interface RefreshTokenResponse {
  success: boolean;
  data?: {
    access_token: string;
    refresh_token: string;
  };
  error?: string;
}

/**
 * Intenta renovar el token de acceso usando el refresh token
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data: RefreshTokenResponse = await response.json();

    if (!data.success || !data.data) {
      // Si falla la renovación, limpiar tokens
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      return false;
    }

    // Guardar nuevos tokens
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.data.access_token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.data.refresh_token);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Wrapper para fetch que maneja la renovación automática del token
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Agregar headers base
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  // Agregar token si existe
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Hacer la petición
  let response = await fetch(url, { ...options, headers });

  // Si es error 401 (Unauthorized), intentar renovar el token
  if (response.status === 401) {
    const refreshSuccess = await refreshAccessToken();

    if (refreshSuccess) {
      // Actualizar el header con el nuevo token
      const newToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      headers.set('Authorization', `Bearer ${newToken}`);

      // Reintentar la petición original con el nuevo token
      response = await fetch(url, { ...options, headers });
    }
  }

  return response;
}
