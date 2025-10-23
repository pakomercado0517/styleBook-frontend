import { z } from 'zod';

/**
 * Schema para validar el login
 * - Email debe ser válido
 * - Contraseña requerida
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Schema para validar el registro
 * - Nombre y apellido mínimo 2 caracteres
 * - Email válido
 * - Contraseña mínimo 8 caracteres con mayúscula, minúscula y número
 * - Rol debe ser client o provider
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es muy largo'),
  apellido: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido es muy largo'),
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe contener mayúscula, minúscula y número'
    ),
  role: z.enum(['client', 'provider'], {
    errorMap: () => ({ message: 'Rol inválido' }),
  }),
});

/**
 * Schema para solicitar recuperación de contraseña
 */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
});

/**
 * Schema para restablecer contraseña con token
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token requerido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Debe contener mayúscula, minúscula y número'
      ),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Schema para reenviar email de verificación
 */
export const resendVerificationSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
});

// Exportar tipos inferidos de los schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
