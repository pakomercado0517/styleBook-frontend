import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { logout as apiLogout } from '@/lib/api/auth';

/**
 * Hook personalizado para manejar autenticación
 * Proporciona acceso al usuario, token y funciones de auth
 */
export function useAuth() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout: logoutStore,
  } = useAuthStore();

  /**
   * Verifica si el usuario es cliente
   */
  const isClient = user?.role === 'client';

  /**
   * Verifica si el usuario es proveedor
   */
  const isProvider = user?.role === 'provider';

  /**
   * Verifica si el usuario es admin
   */
  const isAdmin = user?.role === 'admin';

  /**
   * Cierra sesión y redirige al login
   */
  const logout = () => {
    // Limpiar localStorage
    apiLogout();
    // Limpiar store
    logoutStore();
    // Redirigir al login
    router.push('/login');
  };

  /**
   * Redirige al usuario a su dashboard según su rol
   */
  const redirectToDashboard = () => {
    if (!user) return;

    if (user.role === 'client') {
      router.push('/client');
    } else if (user.role === 'provider') {
      router.push('/provider');
    }
  };

  /**
   * Requiere que el usuario esté autenticado
   * Si no lo está, redirige al login
   */
  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  };

  /**
   * Requiere que el usuario tenga un rol específico
   * Si no lo tiene, redirige según su rol actual
   */
  const requireRole = (role: 'client' | 'provider' | 'admin') => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== role) {
      redirectToDashboard();
    }
  };

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isClient,
    isProvider,
    isAdmin,

    // Acciones
    setAuth,
    logout,
    redirectToDashboard,
    requireAuth,
    requireRole,
  };
}
