import type {
  LoginData,
  RegisterData,
  AuthData,
  ForgotPasswordData,
  ResetPasswordData,
  ResendVerificationData,
  VerifyEmailResponse,
  User,
} from '@/lib/types/auth';
import type { Result } from '@/lib/types/common';
import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';
import { getUserTimezone } from '@/lib/utils/dateUtils';
import { saveAuthData } from '@/lib/utils/auth';
import { removeTokenCookie } from '@/lib/utils/token';

/**
 * Realiza el login del usuario
 * Envía credenciales al backend y retorna usuario + token
 */
export async function login(credentials: LoginData): Promise<Result<AuthData>> {
  try {
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

    // Extraer datos
    const { user, token, refreshToken } = apiResponse.data;
    const memberSince = apiResponse.timestamp;

    // Agregar memberSince al usuario
    const userWithTimestamp = { ...user, memberSince };

    // Guardar tokens y datos
    saveAuthData(userWithTimestamp, token, refreshToken);

    return {
      success: true,
      data: {
        user: userWithTimestamp,
        token,
        refreshToken,
      },
    };
  } catch {
    return {
      success: false,
      error: 'Error de red al iniciar sesión',
    };
  }
}

/**
 * Registra un nuevo usuario
 * Crea la cuenta y envía email de verificación
 * NOTA: El usuario NO puede iniciar sesión hasta verificar su email
 */
export async function register(
  userData: RegisterData
): Promise<Result<AuthData>> {
  try {
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

    // Extraer datos
    const { user, token, refreshToken } = apiResponse.data;

    // NO guardamos tokens ni usuario - debe verificar email primero
    return {
      success: true,
      data: {
        user,
        token, // Token informativo, no se guarda
        refreshToken, // Token informativo, no se guarda
      },
    };
  } catch {
    return {
      success: false,
      error: 'Error de red al registrarse',
    };
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const apiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      return {
        success: false,
        error: apiResponse.message || 'Error al solicitar recuperación',
      };
    }

    return {
      success: true,
      data: { message: apiResponse.data.message },
    };
  } catch {
    return {
      success: false,
      error: 'Error de red al solicitar recuperación',
    };
  }
}

/**
 * Restablece la contraseña usando el token recibido por email
 */
export async function resetPassword(
  data: ResetPasswordData
): Promise<Result<{ message: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const apiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      return {
        success: false,
        error: apiResponse.message || 'Error al restablecer contraseña',
      };
    }

    return {
      success: true,
      data: { message: apiResponse.data.message },
    };
  } catch {
    return {
      success: false,
      error: 'Error de red al restablecer contraseña',
    };
  }
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

/**
 * Verifica el email del usuario con el token recibido por correo
 * @param token Token de verificación de 64 caracteres
 */
export async function verifyEmail(
  token: string
): Promise<Result<VerifyEmailResponse>> {
  try {
    if (!token?.trim()) {
      return {
        success: false,
        error: 'Token no proporcionado',
      };
    }

    // Asegurarnos de que el token esté limpio
    const cleanToken = token.split('/verify-email')[0].trim();

    // Construir URL completa para verificación
    const url = new URL('/api/auth/verify-email', API_BASE_URL);
    url.searchParams.set('token', cleanToken);

    // Hacer la petición directamente sin pasar por el interceptor
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const apiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      return {
        success: false,
        error:
          apiResponse.message || 'Error al verificar email. Token inválido',
      };
    }

    return {
      success: true,
      data: apiResponse.data,
    };
  } catch {
    return {
      success: false,
      error: 'Error de red al verificar email',
    };
  }
}

/**
 * Reenvía el email de verificación con un nuevo token
 * @param email Email del usuario registrado
 */
export async function resendVerificationEmail(
  data: ResendVerificationData
): Promise<Result<{ message: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const apiResponse = await response.json();

    if (!response.ok || !apiResponse.success) {
      return {
        success: false,
        error: apiResponse.message || 'Error al reenviar email de verificación',
      };
    }

    return {
      success: true,
      data: { message: apiResponse.message },
    };
  } catch {
    return {
      success: false,
      error: 'Error de red al reenviar email',
    };
  }
}
