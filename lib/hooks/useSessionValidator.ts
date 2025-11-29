'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { refreshAccessToken } from '@/lib/api/interceptor';
import {
  getAuthToken,
  getRefreshToken,
  getCurrentUser,
} from '@/lib/utils/auth';
import { useRouter } from 'next/navigation';

/**
 * Hook para validar y sincronizar la sesión del usuario
 * Se ejecuta al montar la aplicación y cuando cambia el token
 */
export function useSessionValidator() {
  const router = useRouter();
  const { setAuth, logout } = useAuthStore();

  useEffect(() => {
    async function validateSession() {
      // Obtener la ruta actual
      const currentPath = window.location.pathname;

      // Rutas públicas que NO requieren validación de sesión
      const publicRoutes = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/verify-email-pending',
        '/',
      ];

      // Si estamos en una ruta pública, no validar sesión
      if (publicRoutes.some((route) => currentPath.startsWith(route))) {
        return;
      }

      // Obtener datos actuales
      const currentToken = getAuthToken();
      const currentRefreshToken = getRefreshToken();
      const currentUser = getCurrentUser();

      // Si no hay datos de sesión, hacer logout
      if (!currentToken || !currentRefreshToken || !currentUser) {
        logout();
        router.push('/login');
        return;
      }

      try {
        // Intentar renovar el token
        const refreshSuccess = await refreshAccessToken();

        if (!refreshSuccess) {
          // Si falla la renovación, hacer logout
          logout();
          router.push('/login');
          return;
        }

        // Si se renovó exitosamente, actualizar el store
        const newToken = getAuthToken();
        const newRefreshToken = getRefreshToken();
        if (newToken && newRefreshToken && currentUser) {
          setAuth(currentUser, newToken, newRefreshToken);
        }
      } catch (error) {
        console.log('error', error);
        // Si hay error, hacer logout
        logout();
        router.push('/login');
      }
    }

    // Validar sesión al montar el componente
    validateSession();
  }, [setAuth, logout, router]);
}
