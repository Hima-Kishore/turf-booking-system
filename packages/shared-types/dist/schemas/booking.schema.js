import { z } from 'zod';
// Create booking request
export const createBookingSchema = z.object({
    userId: z.string().uuid(),
    slotId: z.string().uuid(),
});
// Booking response
export const bookingResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    slotId: z.string().uuid(),
    status: z.enum(['confirmed', 'cancelled']),
    totalPrice: z.number(),
    paymentStatus: z.enum(['pending', 'completed']),
    createdAt: z.string(),
});
