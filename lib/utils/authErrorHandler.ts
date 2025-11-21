import { clearAuthData } from '@/lib/utils/auth';

/**
 * Lista de rutas públicas que NO requieren autenticación
 * Estas rutas NUNCA deben ser redirigidas a login
 * CRÍTICO: Mantener sincronizado con middleware.ts
 */
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-email-pending',
  '/resend-verification',
] as const;

/**
 * Lista de rutas de API públicas que NO requieren token
 * CRÍTICO: Mantener sincronizado con interceptor.ts
 */
const PUBLIC_API_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/resend-verification',
] as const;

/**
 * Evento personalizado para errores de autenticación
 */
interface AuthErrorDetail {
  reason: string;
  timestamp: string;
}

/**
 * Verifica si una ruta es pública (no requiere autenticación)
 */
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

/**
 * Verifica si una URL de API es pública
 */
export const isPublicApiRoute = (url: string): boolean => {
  return PUBLIC_API_ROUTES.some((route) => url.includes(route));
};

/**
 * Maneja errores de autenticación de forma centralizada
 * - Limpia localStorage y cookies
 * - Emite evento para que Zustand store se limpie
 * - Redirige a login (solo si NO es ruta pública)
 *
 * IMPORTANTE: NO redirige si estamos en rutas públicas como /verify-email
 */
export const handleAuthError = (
  reason: string = 'Session expired',
  shouldRedirect: boolean = true
): void => {
  // Early return si estamos en el servidor
  if (typeof window === 'undefined') {
    return;
  }

  // Log solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.warn('🚨 Auth Error:', reason);
  }

  // 1. Limpiar localStorage y cookies
  clearAuthData();

  // 2. Emitir evento para que Zustand store se actualice
  const detail: AuthErrorDetail = {
    reason,
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(
    new CustomEvent<AuthErrorDetail>('auth-error', { detail })
  );

  // 3. Redirigir a login solo si:
  //    - shouldRedirect es true
  //    - NO estamos en una ruta pública
  if (!shouldRedirect) {
    return;
  }

  const currentPath = window.location.pathname;

  // CRÍTICO: NO redirigir si estamos en ruta pública
  if (isPublicRoute(currentPath)) {
    return;
  }

  // Construir URL de login con parámetros
  const params = new URLSearchParams();
  params.set('reason', 'session_expired');

  // Guardar ruta actual para redirección después del login
  if (currentPath !== '/login') {
    params.set('from', currentPath);
  }

  const loginUrl = `/login?${params.toString()}`;

  // Redirigir
  window.location.href = loginUrl;
};

/**
 * Verifica si un error es de autenticación (401)
 */
export const isAuthError = (error: unknown): boolean => {
  // Verificar Response
  if (error instanceof Response) {
    return error.status === 401;
  }

  // Verificar objeto con status
  if (error && typeof error === 'object' && 'status' in error) {
    const statusError = error as { status: number };
    return statusError.status === 401;
  }

  return false;
};

/**
 * Verifica si un error es de token expirado
 */
export const isTokenExpiredError = (error: unknown): boolean => {
  // Early return si no es objeto
  if (!error || typeof error !== 'object') {
    return false;
  }

  // Extraer mensaje del error
  const errorMessage =
    'message' in error ? String(error.message).toLowerCase() : '';

  // Verificar palabras clave de token expirado
  const expiredKeywords = [
    'token expired',
    'jwt expired',
    'token inválido',
    'token invalido',
  ];

  return expiredKeywords.some((keyword) => errorMessage.includes(keyword));
};
