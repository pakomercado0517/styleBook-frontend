import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { saveAuthData, getCurrentUser } from '@/lib/utils/auth';
import {
  handleAuthError,
  isPublicApiRoute,
} from '@/lib/utils/authErrorHandler';

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
 * Si falla, llama a handleAuthError para limpiar todo y redirigir
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    // Early return si no hay refresh token
    if (!refreshToken) {
      handleAuthError('No refresh token found');
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

    // Si el refresh falló, manejar error de autenticación
    if (!response.ok || !data.success || !data.data) {
      handleAuthError('Refresh token failed or expired');
      return false;
    }

    // Obtener el usuario actual
    const currentUser = getCurrentUser();
    if (!currentUser) {
      handleAuthError('No current user found');
      return false;
    }

    // Guardar nuevos tokens
    const { access_token, refresh_token } = data.data;
    saveAuthData(currentUser, access_token, refresh_token);

    // Actualizar el store
    const store = useAuthStore.getState();
    store.setAuth(currentUser, access_token, refresh_token);

    return true;
  } catch {
    // Error de red o inesperado
    handleAuthError('Network error during token refresh');
    return false;
  }
};

/**
 * Wrapper para fetch que maneja la renovación automática del token
 * IMPORTANTE: NO intenta refresh en rutas públicas como /auth/verify-email
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Agregar headers base
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  // CRÍTICO: Si es ruta pública, hacer petición sin token
  if (isPublicApiRoute(url)) {
    return fetch(url, { ...options, headers });
  }

  // Para rutas protegidas, agregar token si existe
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Hacer la petición
  let response = await fetch(url, { ...options, headers });

  // Si es error 401 y NO es ruta pública, intentar renovar el token
  if (response.status === 401 && !isPublicApiRoute(url)) {
    const refreshSuccess = await refreshAccessToken();

    if (refreshSuccess) {
      // Actualizar el header con el nuevo token
      const newToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
      }

      // Reintentar la petición original con el nuevo token
      response = await fetch(url, { ...options, headers });
    }
    // Si refresh falló, handleAuthError ya fue llamado en refreshAccessToken
    // No necesitamos hacer nada más aquí
  }

  return response;
};
