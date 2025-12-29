/**
 * Roles de usuario en el sistema
 */
export type UserRole = 'client' | 'provider' | 'admin';

/**
 * Usuario autenticado
 * Estructura simplificada que coincide con el backend
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  timezone?: string;
  memberSince?: string; // Timestamp cuando se creó la cuenta (del login)
  verified?: boolean; // Si el email está verificado
  photo?: string; // URL de la foto de perfil
}

/**
 * Datos para hacer login
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Datos para registrarse
 */
export interface RegisterData {
  name: string;
  apellido: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  timezone?: string;
}

/**
 * Datos que retorna el backend en login/register
 * (sin el wrapper de success/message)
 */
export interface AuthData {
  user: User;
  token: string; // Access token (30 min)
  refreshToken: string; // Refresh token (7 días)
}

/**
 * Datos para solicitar recuperación de contraseña
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Datos para restablecer contraseña
 */
export interface ResetPasswordData {
  token: string;
  password: string;
}

/**
 * Datos para reenviar email de verificación
 */
export interface ResendVerificationData {
  email: string;
}

/**
 * Respuesta de verificación de email
 */
export interface VerifyEmailResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    verified: boolean;
  };
}
