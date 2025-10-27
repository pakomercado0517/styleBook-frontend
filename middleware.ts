import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Decodifica un JWT token sin verificar la firma
 * Solo extrae el payload para obtener información del usuario
 * NOTA: La verificación de firma la hace el backend
 */
function decodeToken(
  token: string
): { id: number; email: string; role: string } | null {
  try {
    // El token tiene formato: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Middleware de protección de rutas
 * Protege rutas privadas y redirige según el rol del usuario
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener token de las cookies o localStorage (via header)
  const token = request.cookies.get('auth_token')?.value;

  // ============================================
  // 1. RUTAS PÚBLICAS (Auth) - /login, /register, /forgot-password
  // ============================================
  // Rutas públicas que no requieren autenticación

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password');

  if (isAuthRoute) {
    // Si ya tiene token válido, redirigir a su dashboard
    if (token) {
      const userData = decodeToken(token);
      if (userData) {
        const dashboardPath =
          userData.role === 'client' ? '/client' : '/provider';
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    }
    // Si no tiene token, permitir acceso a rutas de auth
    return NextResponse.next();
  }

  // ============================================
  // 3. RUTAS PROTEGIDAS - /client/* y /provider/*
  // ============================================
  const isClientRoute = pathname.startsWith('/client');
  const isProviderRoute = pathname.startsWith('/provider');
  const isProtectedRoute = isClientRoute || isProviderRoute;

  if (isProtectedRoute) {
    // Sin token → redirigir a login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      // Guardar la URL a la que intentaba acceder (para redirección después del login)
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Decodificar token para obtener el rol
    const userData = decodeToken(token);

    // Token inválido → redirigir a login
    if (!userData) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Cliente intentando acceder a rutas de proveedor → redirigir a su dashboard
    if (isProviderRoute && userData.role === 'client') {
      return NextResponse.redirect(new URL('/client', request.url));
    }

    // Proveedor intentando acceder a rutas de cliente → redirigir a su dashboard
    if (isClientRoute && userData.role === 'provider') {
      return NextResponse.redirect(new URL('/provider', request.url));
    }

    // Token válido y rol correcto → permitir acceso
    return NextResponse.next();
  }

  // ============================================
  // 4. OTRAS RUTAS (Home, páginas públicas)
  // ============================================
  return NextResponse.next();
}

/**
 * Configuración del middleware
 * Define en qué rutas se ejecutará el middleware
 */
export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas EXCEPTO:
     * - /verify-email (verificación de email)
     * - /api (API routes)
     * - /_next/static (archivos estáticos)
     * - /_next/image (optimización de imágenes)
     * - /favicon.ico, /file.svg, etc. (archivos públicos)
     */
    '/((?!verify-email|api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
