import { z } from 'zod';

/**
 * Schema para crear un empleado
 * Valida los datos según la documentación de la API (10_EMPLOYEES.md)
 */
export const createEmployeeSchema = z.object({
  provider_id: z.number().int().positive('El ID del proveedor debe ser un número positivo'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  email: z
    .string()
    .email('Debe ser un email válido')
    .min(1, 'El email es requerido'),
  phone: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  specialty: z
    .string()
    .max(50, 'La especialidad no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
  photo_url: z
    .union([
      z.string().url('Debe ser una URL válida'),
      z.literal(''),
    ])
    .optional(),
});

/**
 * Schema para actualizar un empleado
 * Todos los campos son opcionales excepto que deben cumplir las mismas validaciones
 */
export const updateEmployeeSchema = createEmployeeSchema
  .omit({ provider_id: true })
  .partial();

// Tipos inferidos
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

