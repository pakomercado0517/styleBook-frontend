import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Obtiene el token de autenticación del localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Obtiene los headers base para las peticiones autenticadas
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Verifica si hay una sesión activa
 */
export function hasActiveSession(): boolean {
  return !!getAuthToken();
}
