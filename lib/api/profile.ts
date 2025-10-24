import type {
  UpdateProfileData,
  ChangePasswordData,
  ProfileUpdateResponse,
} from '@/lib/types/profile';
import type { Result } from '@/lib/types/common';
import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';

/**
 * Actualiza los datos del perfil del usuario
 * Guarda los datos actualizados en localStorage
 */
export async function updateProfile(
  userId: number,
  data: UpdateProfileData
): Promise<Result<ProfileUpdateResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al actualizar el perfil',
      };
    }

    const responseData = await response.json();

    // Si la actualización es exitosa, actualizar localStorage
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          const updatedUser = { ...user, ...responseData.data };
          localStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(updatedUser)
          );
        } catch {
          // Error al parsear, continuar sin actualizar
        }
      }
    }

    return { success: true, data: responseData.data };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}

/**
 * Cambia la contraseña del usuario autenticado
 * Usa el token JWT para identificar al usuario
 * Requiere contraseña actual para validación
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<Result<{ message: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Error al cambiar la contraseña',
      };
    }

    const responseData = await response.json();
    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, error: 'Error de red' };
  }
}
