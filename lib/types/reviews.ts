import type { Result } from './common';
import type { User } from './auth';
import type { ProviderProfile } from './provider';
import type { Appointment } from './appointments';

/**
 * Reseña de un cliente sobre un servicio
 * - Relacionada con una cita completada
 * - Rating de 1 a 5 estrellas
 * - Comentario opcional
 */
export interface Review {
  id: number;
  appointment_id: number;
  client_id: number;
  provider_id: number;
  rating: number; // 1-5
  comment?: string | null;
  createdAt: string;
  updatedAt?: string;
  // Relaciones (opcionales, vienen del backend con include)
  client?: User;
  provider?: ProviderProfile;
  appointment?: Appointment;
  // Campos para respuestas del proveedor (futuro)
  response?: string | null;
  respondedAt?: string | null;
}

/**
 * Datos para crear una reseña
 * - Requiere appointment_id, rating (1-5)
 * - Comentario opcional (máx 500 caracteres)
 */
export interface CreateReviewData {
  appointment_id: number;
  rating: number; // 1-5
  comment?: string;
}

/**
 * Datos para actualizar una reseña
 * - Solo el autor puede actualizar
 * - Rating y comentario opcionales
 */
export interface UpdateReviewData {
  rating?: number; // 1-5
  comment?: string; // Máx 500 caracteres
}

/**
 * Estadísticas de rating de un proveedor
 * - Promedio de ratings
 * - Total de reseñas
 * - Distribución por rating (1-5)
 */
export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

/**
 * Respuesta paginada de reseñas del proveedor
 */
export interface ProviderReviewsResponse {
  reviews: Review[];
  statistics?: {
    total: number;
    averageRating: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  // Campos legacy para compatibilidad
  total?: number;
  count?: number;
  limit?: number;
  offset?: number;
  data?: Review[];
  provider_average_rating?: number;
}

/**
 * Respuesta paginada de mis reseñas (cliente)
 */
export interface MyReviewsResponse {
  reviews: Review[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  // Campos legacy para compatibilidad
  total?: number;
  count?: number;
  limit?: number;
  offset?: number;
  data?: Review[];
}

/**
 * Tipos de respuesta de la API
 */
export type CreateReviewResponse = Result<Review>;
export type GetReviewResponse = Result<Review>;
export type GetProviderReviewsResponse = Result<ProviderReviewsResponse>;
export type GetMyReviewsResponse = Result<MyReviewsResponse>;
export type UpdateReviewResponse = Result<Review>;
export type DeleteReviewResponse = Result<{ message: string }>;
export type GetReviewStatsResponse = Result<ReviewStats>;
