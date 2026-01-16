import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const signupSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    name: string;
    phone?: string | undefined;
}>;
export declare const authResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        phone: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        email: string;
        name: string;
        phone: string | null;
    }, {
        id: string;
        createdAt: string;
        email: string;
        name: string;
        phone: string | null;
    }>;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        createdAt: string;
        email: string;
        name: string;
        phone: string | null;
    };
    accessToken: string;
    refreshToken: string;
}, {
    user: {
        id: string;
        createdAt: string;
        email: string;
        name: string;
        phone: string | null;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const userProfileSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    phone: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    email: string;
    name: string;
    phone: string | null;
}, {
    id: string;
    createdAt: string;
    email: string;
    name: string;
    phone: string | null;
}>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
//# sourceMappingURL=auth.schema.d.ts.map