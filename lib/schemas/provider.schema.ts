import { z } from 'zod';

/**
 * Schema para actualizar perfil del proveedor
 * Valida todos los campos del negocio
 */
export const updateProviderProfileSchema = z.object({
  business_name: z
    .string()
    .min(2, 'El nombre del negocio debe tener al menos 2 caracteres')
    .max(100, 'El nombre del negocio es muy largo')
    .optional(),

  business_type: z
    .enum(['salon', 'barbershop', 'spa', 'nails', 'makeup', 'hair', 'other'], {
      errorMap: () => ({ message: 'Tipo de negocio inválido' }),
    })
    .optional(),

  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),

  opening_time: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)')
    .optional()
    .or(z.literal('')),

  closing_time: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)')
    .optional()
    .or(z.literal('')),

  address: z
    .string()
    .max(200, 'La dirección es muy larga')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .max(100, 'El nombre de la ciudad es muy largo')
    .optional()
    .or(z.literal('')),

  country: z
    .string()
    .max(100, 'El nombre del país es muy largo')
    .optional()
    .or(z.literal('')),

  is_active: z.boolean().optional(),
});

// Exportar tipo inferido
export type UpdateProviderProfileInput = z.infer<
  typeof updateProviderProfileSchema
>;

/**
 * Schema para crear perfil de proveedor durante el registro
 * Campos requeridos: business_name y business_type
 */
export const createProviderSchema = z.object({
  business_name: z
    .string()
    .min(2, 'El nombre del negocio debe tener al menos 2 caracteres')
    .max(100, 'El nombre del negocio es muy largo'),

  business_type: z.enum(
    ['salon', 'barbershop', 'spa', 'nails', 'makeup', 'hair', 'other'],
    {
      errorMap: () => ({ message: 'Tipo de negocio inválido' }),
    }
  ),

  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),

  opening_time: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)')
    .optional()
    .or(z.literal('')),

  closing_time: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)')
    .optional()
    .or(z.literal('')),

  address: z
    .string()
    .max(200, 'La dirección es muy larga')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .max(100, 'El nombre de la ciudad es muy largo')
    .optional()
    .or(z.literal('')),

  country: z
    .string()
    .max(100, 'El nombre del país es muy largo')
    .optional()
    .or(z.literal('')),
});

// Exportar tipo inferido
export type CreateProviderInput = z.infer<typeof createProviderSchema>;
