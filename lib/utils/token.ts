/**
 * Utilidades para manejo de JWT tokens en el cliente
 */

/**
 * Decodifica un JWT token y extrae el payload
 * NOTA: No verifica la firma, solo decodifica
 * La verificación la hace el backend
 */
export function decodeJWT<T = Record<string, unknown>>(
  token: string
): T | null {
  try {
    // JWT tiene formato: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decodificar el payload (parte del medio)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

/**
 * Verifica si un token ha expirado
 * Revisa el campo 'exp' del payload
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT<{ exp?: number }>(token);
  if (!payload || !payload.exp) return true;

  // exp está en segundos, Date.now() en milisegundos
  return payload.exp * 1000 < Date.now();
}

/**
 * Guarda el token en una cookie
 * Útil para que el middleware pueda accederlo
 */
export function setTokenCookie(token: string): void {
  if (typeof document === 'undefined') return;

  // Calcular fecha de expiración (1 día)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  document.cookie = `auth_token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Elimina el token de la cookie
 */
export function removeTokenCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie =
    'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/**
 * Obtiene el token de la cookie
 */
export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const name = 'auth_token=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return null;
}
