import { put } from './client';
import type {
  UpdateProfileData,
  ChangePasswordData,
  ProfileUpdateResponse,
} from '@/lib/types/profile';
import type { Result } from '@/lib/types/common';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Actualiza los datos del perfil del usuario
 * Guarda los datos actualizados en localStorage
 */
export async function updateProfile(
  userId: number,
  data: UpdateProfileData
): Promise<Result<ProfileUpdateResponse>> {
  const result = await put<ProfileUpdateResponse>(`/users/${userId}`, data);

  // Si la actualización es exitosa, actualizar localStorage
  if (result.success && typeof window !== 'undefined') {
    const currentUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        const updatedUser = { ...user, ...result.data };
        localStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(updatedUser)
        );
      } catch {
        // Error al parsear, continuar sin actualizar
      }
    }
  }

  return result;
}

/**
 * Cambia la contraseña del usuario autenticado
 * Usa el token JWT para identificar al usuario
 * Requiere contraseña actual para validación
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<Result<{ message: string }>> {
  return put<{ message: string }>('/auth/change-password', data);
}
