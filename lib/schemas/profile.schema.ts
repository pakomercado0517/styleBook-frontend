import { z } from 'zod';

/**
 * Schema para actualizar perfil de usuario
 * Valida nombre, teléfono y dirección opcionales
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es muy largo'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]+$/, 'Formato de teléfono inválido')
    .min(8, 'Teléfono muy corto')
    .max(20, 'Teléfono muy largo')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'Dirección muy larga')
    .optional()
    .or(z.literal('')),
  timezone: z.string().optional(),
});

/**
 * Schema para cambiar contraseña
 * Valida contraseña actual y nueva con confirmación
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresa tu contraseña actual'),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Debe incluir mayúsculas, minúsculas y números'
      ),
    confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Exportar tipos inferidos
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
