import { z } from 'zod';

/**
 * Schema para crear una reseña
 * - Valida que appointment_id sea un entero positivo
 * - Rating debe estar entre 1 y 5
 * - Comentario opcional, máximo 500 caracteres
 */
export const createReviewSchema = z.object({
  appointment_id: z
    .number()
    .int('ID de cita debe ser un número entero')
    .positive('ID de cita inválido'),

  rating: z
    .number()
    .int('El rating debe ser un número entero')
    .min(1, 'El rating mínimo es 1')
    .max(5, 'El rating máximo es 5'),

  comment: z
    .string()
    .max(500, 'El comentario no puede exceder 500 caracteres')
    .optional(),
});

/**
 * Schema para actualizar una reseña
 * - Rating y comentario opcionales
 * - Si se proporciona rating, debe estar entre 1 y 5
 * - Si se proporciona comentario, máximo 500 caracteres
 */
export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int('El rating debe ser un número entero')
    .min(1, 'El rating mínimo es 1')
    .max(5, 'El rating máximo es 5')
    .optional(),

  comment: z
    .string()
    .max(500, 'El comentario no puede exceder 500 caracteres')
    .optional(),
});

// Exportar tipos inferidos de schemas
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;


