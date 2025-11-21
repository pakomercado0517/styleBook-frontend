import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Payload del JWT token
 */
interface TokenPayload {
  id: number;
  email: string;
  role: string;
  exp?: number; // Timestamp de expiración (en segundos)
  iat?: number; // Timestamp de emisión (en segundos)
}

/**
 * Decodifica un JWT token sin verificar la firma
 * Solo extrae el payload para obtener información del usuario
 * NOTA: La verificación de firma la hace el backend
 */
const decodeToken = (token: string): TokenPayload | null => {
  try {
    // El token tiene formato: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded) as TokenPayload;

    return parsed;
  } catch {
    return null;
  }
};

/**
 * Verifica si un token está expirado
 * @param token - Token JWT a verificar
 * @returns true si el token está expirado o es inválido
 */
const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);

  // Si no se puede decodificar, considerar expirado
  if (!payload) {
    return true;
  }

  // Si no tiene exp, considerar válido (el backend lo verificará)
  if (!payload.exp) {
    return false;
  }

  // Verificar si exp está en el pasado
  const now = Math.floor(Date.now() / 1000); // Convertir a segundos
  return payload.exp < now;
};

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
    // Si ya tiene token válido y NO expirado, redirigir a su dashboard
    if (token && !isTokenExpired(token)) {
      const userData = decodeToken(token);
      if (userData) {
        const dashboardPath =
          userData.role === 'client' ? '/client' : '/provider';
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    }
    // Si no tiene token o está expirado, permitir acceso a rutas de auth
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
      loginUrl.searchParams.set('from', pathname);
      loginUrl.searchParams.set('reason', 'no_token');
      return NextResponse.redirect(loginUrl);
    }

    // Token expirado → redirigir a login
    if (isTokenExpired(token)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      loginUrl.searchParams.set('reason', 'token_expired');
      return NextResponse.redirect(loginUrl);
    }

    // Decodificar token para obtener el rol
    const userData = decodeToken(token);

    // Token inválido (no se puede decodificar) → redirigir a login
    if (!userData) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'invalid_token');
      return NextResponse.redirect(loginUrl);
    }

    // Cliente intentando acceder a rutas de proveedor → redirigir a su dashboard
    if (isProviderRoute && userData.role === 'client') {
      return NextResponse.redirect(new URL('/client', request.url));
    }

    // Proveedor intentando acceder a rutas de cliente → redirigir a su dashboard
    if (isClientRoute && userData.role === 'provider') {
      return NextResponse.redirect(new URL('/provider', request.url));
    }

    // Token válido, no expirado y rol correcto → permitir acceso
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
 * CRÍTICO: Mantener sincronizado con PUBLIC_ROUTES en authErrorHandler.ts
 */
export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas EXCEPTO:
     * - /verify-email* (verificación de email - CRÍTICO)
     * - /verify-email-pending (pendiente de verificación)
     * - /resend-verification (reenvío de verificación)
     * - /reset-password (reseteo de contraseña)
     * - /api (API routes)
     * - /_next/static (archivos estáticos)
     * - /_next/image (optimización de imágenes)
     * - /favicon.ico, /file.svg, etc. (archivos públicos)
     */
    '/((?!verify-email|verify-email-pending|resend-verification|reset-password|api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
