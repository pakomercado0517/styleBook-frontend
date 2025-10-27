import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { saveAuthData, clearAuthData, getCurrentUser } from '@/lib/utils/auth';

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
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      clearAuthData();
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
      clearAuthData();
      return false;
    }

    // Obtener el usuario actual
    const currentUser = getCurrentUser();
    if (!currentUser) {
      clearAuthData();
      return false;
    }

    // Guardar nuevos tokens y actualizar todo
    const { access_token, refresh_token } = data.data;
    saveAuthData(currentUser, access_token, refresh_token);

    // Actualizar el store
    const store = useAuthStore.getState();
    store.setAuth(currentUser, access_token, refreshToken);

    return true;
  } catch (error) {
    clearAuthData();
    return false;
  }
}

/**
 * Lista de rutas públicas que no requieren token ni refresh
 */
const PUBLIC_ROUTES = [
  '/auth/register',
  '/auth/login',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/resend-verification',
];

/**
 * Verifica si una URL es una ruta pública
 */
function isPublicRoute(url: string): boolean {
  return PUBLIC_ROUTES.some((route) => url.includes(route));
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

  // Si es una ruta pública, hacer la petición sin token
  if (isPublicRoute(url)) {
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
  if (response.status === 401 && !isPublicRoute(url)) {
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
