'use client';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook para escuchar eventos de autenticación
 * y actualizar el estado de la aplicación
 */
export function useAuthEvents() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  useEffect(() => {
    function handleAuthChanged(
      event: CustomEvent<{ isAuthenticated: boolean }>
    ) {
      if (!event.detail.isAuthenticated) {
        // Invalidar todas las queries al perder autenticación
        queryClient.invalidateQueries();
        // Limpiar cache
        queryClient.clear();
        // Hacer logout
        logout();
      }
    }

    // Escuchar eventos de autenticación
    window.addEventListener('auth-changed', handleAuthChanged as EventListener);

    return () => {
      window.removeEventListener(
        'auth-changed',
        handleAuthChanged as EventListener
      );
    };
  }, [queryClient, logout]);
}
