import { z } from 'zod';

/**
 * Schema para verificar IDs de favoritos
 * - Valida que los IDs sean números enteros positivos
 */
export const favoriteIdSchema = z.object({
  id: z.number().int('ID debe ser un número entero').positive('ID inválido'),
});

/**
 * Schema para verificar ID de proveedor
 */
export const providerIdSchema = z.object({
  provider_id: z
    .number()
    .int('ID de proveedor debe ser un número entero')
    .positive('ID de proveedor inválido'),
});

/**
 * Schema para verificar ID de servicio
 */
export const serviceIdSchema = z.object({
  service_id: z
    .number()
    .int('ID de servicio debe ser un número entero')
    .positive('ID de servicio inválido'),
});

// Exportar tipos inferidos de schemas
export type FavoriteIdInput = z.infer<typeof favoriteIdSchema>;
export type ProviderIdInput = z.infer<typeof providerIdSchema>;
export type ServiceIdInput = z.infer<typeof serviceIdSchema>;
