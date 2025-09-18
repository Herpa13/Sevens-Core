import { z } from 'zod';
export declare const CountrySchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"new">]>;
    name: z.ZodString;
    iso: z.ZodString;
    notificationProcess: z.ZodOptional<z.ZodString>;
    requiredDocuments: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number | "new";
    iso: string;
    notificationProcess?: string | undefined;
    requiredDocuments?: string | undefined;
}, {
    name: string;
    id: number | "new";
    iso: string;
    notificationProcess?: string | undefined;
    requiredDocuments?: string | undefined;
}>;
export type Country = z.infer<typeof CountrySchema>;
