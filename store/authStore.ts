import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { User } from '@/lib/types/auth';
import { getCurrentUser, getAuthToken } from '@/lib/api/auth';
import { saveAuthData, clearAuthData } from '@/lib/utils/auth';

/**
 * Estado de autenticación
 */
interface AuthState {
  user: User | undefined;
  token: string | undefined;
  refreshToken: string | undefined;
  isAuthenticated: boolean;
}

/**
 * Acciones del store de autenticación
 */
interface AuthActions {
  /**
   * Guarda el usuario y tokens después de login/register exitoso
   */
  setAuth: (user: User, token: string, refreshToken: string) => void;

  /**
   * Actualiza solo el token de acceso (después de refresh)
   */
  updateAccessToken: (token: string) => void;

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
 * Persiste el estado en localStorage y soporta suscripciones
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        // Estado inicial
        user: undefined,
        token: undefined,
        refreshToken: undefined,
        isAuthenticated: false,

        // Guardar usuario y tokens después de login/register
        setAuth: (user: User, token: string, refreshToken: string) => {
          // Guardar en localStorage y cookies
          saveAuthData(user, token, refreshToken);

          // Actualizar store
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
          });
        },

        // Actualizar solo el token de acceso
        updateAccessToken: (token: string) => {
          set((state) => ({
            ...state,
            token,
          }));
        },

        // Limpiar estado al hacer logout
        logout: () => {
          // Limpiar localStorage y cookies
          clearAuthData();

          // Limpiar store
          set({
            user: undefined,
            token: undefined,
            refreshToken: undefined,
            isAuthenticated: false,
          });
        },

        // Hidratar estado desde localStorage
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
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
        }),
      }
    )
  )
);

// Suscribirse a cambios en la autenticación
useAuthStore.subscribe(
  (state) => state.isAuthenticated,
  (isAuthenticated) => {
    // Si se pierde la autenticación, emitir evento
    if (!isAuthenticated && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('auth-changed', { detail: { isAuthenticated } })
      );
    }
  }
);

// Escuchar eventos de error de autenticación para limpiar el store
if (typeof window !== 'undefined') {
  window.addEventListener('auth-error', () => {
    // Limpiar el store cuando hay error de autenticación
    const store = useAuthStore.getState();
    store.logout();
  });
}
