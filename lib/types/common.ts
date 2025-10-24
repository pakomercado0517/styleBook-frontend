/**
 * Tipo genérico para respuestas de la API
 * - success: true → data contiene el resultado
 * - success: false → error contiene el mensaje de error
 */
export type Result<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

/**
 * Tipo para respuestas paginadas genéricas
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  count: number;
  limit: number;
  offset: number;
}
