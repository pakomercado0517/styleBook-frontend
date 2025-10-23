/**
 * Tipo genérico para respuestas de la API
 * Permite manejar éxito y error de forma type-safe
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Respuesta estándar del backend
 */
export interface ApiResponse<T> {
  success?: boolean;
  status?: number;
  data?: T;
  message?: string;
  timestamp?: string;
  errors?: Array<{ field: string; message: string }>; // Errores de validación del backend
}

/**
 * Opciones de paginación
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
