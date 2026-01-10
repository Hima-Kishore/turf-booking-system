import { z } from 'zod';
// Standard API response wrapper
export const apiResponseSchema = (dataSchema) => z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
});
// Error response
export const errorResponseSchema = z.object({
    success: z.literal(false),
    error: z.string(),
    message: z.string(),
});
