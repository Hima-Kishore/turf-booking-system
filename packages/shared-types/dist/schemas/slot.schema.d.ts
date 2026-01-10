import { z } from 'zod';
export declare const slotAvailabilityQuerySchema: z.ZodObject<{
    courtId: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    courtId: string;
    date: string;
}, {
    courtId: string;
    date: string;
}>;
export declare const slotResponseSchema: z.ZodObject<{
    id: z.ZodString;
    courtId: z.ZodString;
    date: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    isBooked: z.ZodBoolean;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    courtId: string;
    date: string;
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    price: number;
}, {
    courtId: string;
    date: string;
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    price: number;
}>;
export declare const slotsResponseSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    courtId: z.ZodString;
    date: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    isBooked: z.ZodBoolean;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    courtId: string;
    date: string;
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    price: number;
}, {
    courtId: string;
    date: string;
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    price: number;
}>, "many">;
export type SlotAvailabilityQuery = z.infer<typeof slotAvailabilityQuerySchema>;
export type SlotResponse = z.infer<typeof slotResponseSchema>;
export type SlotsResponse = z.infer<typeof slotsResponseSchema>;
//# sourceMappingURL=slot.schema.d.ts.map