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
  token: string;
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
