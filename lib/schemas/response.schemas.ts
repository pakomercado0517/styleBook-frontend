import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
