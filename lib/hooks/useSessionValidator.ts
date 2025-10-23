'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api/client';

/**
 * Hook para validar la sesión periódicamente
 * Se usa en el layout del dashboard
 */
export function useSessionValidator() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!token || !user) return;

    // Validar sesión cada 5 minutos
    const interval = setInterval(
      async () => {
        const result = await apiClient('/auth/validate');

        if (!result.success) {
          await logout();
          toast.error(
            'Tu sesión ha expirado. Por favor inicia sesión nuevamente'
          );
          router.push('/login');
        }
      },
      5 * 60 * 1000
    ); // 5 minutos

    // Validar cuando la ventana recupera el focus
    const handleFocus = async () => {
      const result = await apiClient('/auth/validate');

      if (!result.success) {
        await logout();
        toast.error(
          'Tu sesión ha expirado. Por favor inicia sesión nuevamente'
        );
        router.push('/login');
      }
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [token, user, logout, router]);
}
