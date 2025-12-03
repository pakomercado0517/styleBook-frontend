import { z } from 'zod';

/**
 * Schema para filtros de búsqueda de servicios
 * Valida parámetros de búsqueda y filtrado
 */
export const serviceFiltersSchema = z.object({
  search: z.string().optional(),
  category: z
    .enum([
      'corte',
      'tinte',
      'peinado',
      'manicure',
      'pedicure',
      'tratamiento_capilar',
      'barba',
      'afeitado',
      'masaje',
      'facial',
      'corporal',
      'aromaterapia',
      'limpieza_dental',
      'estetica_dental',
    ])
    .optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  provider_id: z.number().int().positive().optional(),
  city: z.string().optional(),
  is_active: z.boolean().optional(),
  sort_by: z
    .enum(['price_asc', 'price_desc', 'rating', 'name', 'newest'])
    .optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

/**
 * Schema para crear un servicio
 */
export const createServiceSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es muy largo'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción es muy larga'),
  category: z.enum([
    'corte',
    'tinte',
    'peinado',
    'manicure',
    'pedicure',
    'tratamiento_capilar',
    'barba',
    'afeitado',
    'masaje',
    'facial',
    'corporal',
    'aromaterapia',
    'limpieza_dental',
    'estetica_dental',
  ]),
  price: z.number().min(0, 'El precio debe ser positivo'),
  duration_minutes: z
    .number()
    .int()
    .min(15, 'La duración mínima es 15 minutos')
    .max(480, 'La duración máxima es 8 horas'),
  is_active: z.boolean().default(true),
  image_url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
});

/**
 * Schema para actualizar un servicio
 */
export const updateServiceSchema = createServiceSchema.partial();

// Tipos inferidos
export type ServiceFiltersInput = z.infer<typeof serviceFiltersSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
