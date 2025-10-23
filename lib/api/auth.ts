import { post } from './client';
import type {
  LoginData,
  RegisterData,
  AuthData,
  ForgotPasswordData,
  ResetPasswordData,
  User,
} from '@/lib/types/auth';
import type { Result } from '@/lib/types/common';
import { STORAGE_KEYS, API_BASE_URL } from '@/lib/constants';
import { getUserTimezone } from '@/lib/utils/dateUtils';
import { setTokenCookie, removeTokenCookie } from '@/lib/utils/token';

/**
 * Realiza el login del usuario
 * Envía credenciales al backend y retorna usuario + token
 */
export async function login(credentials: LoginData): Promise<Result<AuthData>> {
  // Hacer la petición con el cliente que retorna ApiResponse<AuthData>
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const apiResponse = await response.json();

  if (!response.ok || !apiResponse.success) {
    return {
      success: false,
      error: apiResponse.message || 'Error al iniciar sesión',
    };
  }

  // Extraer datos y timestamp
  const { user, token } = apiResponse.data;
  const memberSince = apiResponse.timestamp;

  // Agregar memberSince al usuario
  const userWithTimestamp = { ...user, memberSince };

  // Guardar token en localStorage y cookie
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userWithTimestamp)
    );
    // Guardar en cookie para que el middleware pueda accederlo
    setTokenCookie(token);
  }

  // Retornar datos del usuario con memberSince
  return {
    success: true,
    data: {
      user: userWithTimestamp,
      token,
    },
  };
}

/**
 * Registra un nuevo usuario
 * Crea la cuenta y retorna usuario + token automáticamente
 */
export async function register(
  userData: RegisterData
): Promise<Result<AuthData>> {
  // Agregar timezone del usuario automáticamente
  const dataWithTimezone = {
    ...userData,
    timezone: userData.timezone || getUserTimezone(),
  };

  // Hacer la petición
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataWithTimezone),
  });

  const apiResponse = await response.json();

  if (!response.ok || !apiResponse.success) {
    return {
      success: false,
      error: apiResponse.message || 'Error al registrarse',
    };
  }

  // Extraer datos y timestamp
  const { user, token } = apiResponse.data;
  const memberSince = apiResponse.timestamp;

  // Agregar memberSince al usuario
  const userWithTimestamp = { ...user, memberSince };

  // Guardar token en localStorage y cookie
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userWithTimestamp)
    );
    // Guardar en cookie para que el middleware pueda accederlo
    setTokenCookie(token);
  }

  // Retornar datos del usuario con memberSince
  return {
    success: true,
    data: {
      user: userWithTimestamp,
      token,
    },
  };
}

/**
 * Cierra la sesión del usuario
 * Limpia el token y datos de localStorage y cookies
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    // Eliminar token de la cookie
    removeTokenCookie();
  }
}

/**
 * Solicita un enlace de recuperación de contraseña
 * Envía email al usuario con el enlace
 */
export async function forgotPassword(
  data: ForgotPasswordData
): Promise<Result<{ message: string }>> {
  return post<{ message: string }>('/auth/forgot-password', data);
}

/**
 * Restablece la contraseña usando el token recibido por email
 */
export async function resetPassword(
  data: ResetPasswordData
): Promise<Result<{ message: string }>> {
  return post<{ message: string }>('/auth/reset-password', data);
}

/**
 * Obtiene el usuario autenticado actual desde localStorage
 * Útil para hidratar el estado al recargar la página
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
 * Obtiene el token de autenticación actual desde localStorage
 */
export function getAuthToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || undefined;
}

/**
 * Verifica si el usuario está autenticado
 * Chequea si existe token válido
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
