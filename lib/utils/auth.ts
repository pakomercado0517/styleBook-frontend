import { STORAGE_KEYS } from '@/lib/constants';
import { setTokenCookie, removeTokenCookie } from '@/lib/utils/token';
import type { User } from '@/lib/types/auth';

/**
 * Obtiene el token de acceso del localStorage
 */
export function getAuthToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || undefined;
}

/**
 * Obtiene el refresh token del localStorage
 */
export function getRefreshToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || undefined;
}

/**
 * Obtiene el usuario actual del localStorage
 */
export function getCurrentUser(): User | undefined {
  if (typeof window === 'undefined') return undefined;

  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) return undefined;

  try {
    return JSON.parse(userData) as User;
  } catch {
    return undefined;
  }
}

/**
 * Guarda los tokens y datos del usuario
 */
export function saveAuthData(
  user: User,
  token: string,
  refreshToken: string
): void {
  if (typeof window === 'undefined') return;

  // Guardar tokens
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

  // Guardar cookie para el middleware
  setTokenCookie(token);
}

/**
 * Limpia todos los datos de autenticación
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  removeTokenCookie();
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getCurrentUser();
}
