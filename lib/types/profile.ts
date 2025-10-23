/**
 * Tipos relacionados con el perfil de usuario
 */

/**
 * Datos para actualizar el perfil de usuario
 */
export interface UpdateProfileData {
  name: string;
  phone?: string;
  address?: string;
  timezone?: string;
}

/**
 * Datos para cambiar la contraseña
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Respuesta del perfil actualizado
 */
export interface ProfileUpdateResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  timezone: string;
  role: 'client' | 'provider' | 'admin';
  updatedAt: string;
}
