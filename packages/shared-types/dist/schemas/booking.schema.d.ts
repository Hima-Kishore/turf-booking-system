import { z } from 'zod';
export declare const createBookingSchema: z.ZodObject<{
    userId: z.ZodString;
    slotId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    slotId: string;
}, {
    userId: string;
    slotId: string;
}>;
export declare const bookingResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    slotId: z.ZodString;
    status: z.ZodEnum<["confirmed", "cancelled"]>;
    totalPrice: z.ZodNumber;
    paymentStatus: z.ZodEnum<["pending", "completed"]>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "confirmed" | "cancelled";
    id: string;
    userId: string;
    slotId: string;
    totalPrice: number;
    paymentStatus: "pending" | "completed";
    createdAt: string;
}, {
    status: "confirmed" | "cancelled";
    id: string;
    userId: string;
    slotId: string;
    totalPrice: number;
    paymentStatus: "pending" | "completed";
    createdAt: string;
}>;
export type CreateBookingRequest = z.infer<typeof createBookingSchema>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
//# sourceMappingURL=booking.schema.d.ts.map