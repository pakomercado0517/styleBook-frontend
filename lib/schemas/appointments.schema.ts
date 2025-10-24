import { z } from 'zod';

/**
 * Schema para crear una cita
 * - Valida que todos los campos requeridos estén presentes
 * - Las fechas deben estar en timezone local del usuario
 * - El backend se encarga de convertir a UTC
 */
export const createAppointmentSchema = z
  .object({
    service_id: z
      .number()
      .int('ID de servicio debe ser un número entero')
      .positive('ID de servicio inválido'),

    employee_id: z
      .number()
      .int('ID de empleado debe ser un número entero')
      .positive('ID de empleado inválido'),

    start_date: z
      .string()
      .datetime('Fecha de inicio debe ser ISO 8601')
      .refine((date) => {
        const now = new Date();
        const startDate = new Date(date);
        return startDate > now;
      }, 'La fecha de inicio debe ser futura'),

    end_date: z
      .string()
      .datetime('Fecha de fin debe ser ISO 8601')
      .refine((date) => {
        const now = new Date();
        const endDate = new Date(date);
        return endDate > now;
      }, 'La fecha de fin debe ser futura'),

    notes: z
      .string()
      .max(500, 'Las notas no pueden exceder 500 caracteres')
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      path: ['end_date'],
    }
  );

/**
 * Schema para actualizar una cita
 * - Solo se puede actualizar status y notas
 * - El status debe ser uno de los valores permitidos
 */
export const updateAppointmentSchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'], {
      errorMap: () => ({ message: 'Estado de cita inválido' }),
    })
    .optional(),

  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
});

// Exportar tipos inferidos de schemas
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
