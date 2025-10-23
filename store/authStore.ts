import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types/auth';
import { getCurrentUser, getAuthToken } from '@/lib/api/auth';

/**
 * Estado de autenticación
 */
interface AuthState {
  user: User | undefined;
  token: string | undefined;
  isAuthenticated: boolean;
}

/**
 * Acciones del store de autenticación
 */
interface AuthActions {
  /**
   * Guarda el usuario y token después de login/register exitoso
   */
  setAuth: (user: User, token: string) => void;

  /**
   * Limpia el estado al hacer logout
   */
  logout: () => void;

  /**
   * Hidrata el estado desde localStorage (al recargar página)
   */
  hydrate: () => void;
}

/**
 * Store de autenticación con Zustand
 * Persiste el estado en localStorage automáticamente
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Estado inicial
      user: undefined,
      token: undefined,
      isAuthenticated: false,

      // Guardar usuario y token después de login/register
      setAuth: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Limpiar estado al hacer logout
      logout: () => {
        set({
          user: undefined,
          token: undefined,
          isAuthenticated: false,
        });
      },

      // Hidratar estado desde localStorage (al recargar)
      hydrate: () => {
        const user = getCurrentUser();
        const token = getAuthToken();

        if (user && token) {
          set({
            user,
            token,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage', // Nombre en localStorage
      // Solo persistir user y token (isAuthenticated se calcula)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
