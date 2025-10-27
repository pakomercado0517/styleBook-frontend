/**
 * URLs base
 * Se obtienen de las variables de entorno
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

/**
 * Configuración de paginación
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Tiempos de cache (en milisegundos)
 */
export const CACHE_TIME = {
  SHORT: 1 * 60 * 1000, // 1 minuto
  MEDIUM: 5 * 60 * 1000, // 5 minutos
  LONG: 30 * 60 * 1000, // 30 minutos
} as const;

/**
 * Claves de localStorage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  TIMEZONE: 'user_timezone',
} as const;
