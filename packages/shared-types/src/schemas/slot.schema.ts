import { z } from 'zod';

// Slot availability query schema
export const slotAvailabilityQuerySchema = z.object({
  courtId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Slot response schema
export const slotResponseSchema = z.object({
  id: z.string().uuid(),
  courtId: z.string().uuid(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  isBooked: z.boolean(),
  price: z.number(),
});

// Array of slots
export const slotsResponseSchema = z.array(slotResponseSchema);

// Types inferred from schemas
export type SlotAvailabilityQuery = z.infer<typeof slotAvailabilityQuerySchema>;
export type SlotResponse = z.infer<typeof slotResponseSchema>;
export type SlotsResponse = z.infer<typeof slotsResponseSchema>;