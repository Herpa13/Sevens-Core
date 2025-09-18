import { z } from 'zod';
export declare const CompanySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    country: z.ZodString;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    slug: string;
    country: string;
    currency: string;
}, {
    name: string;
    id: string;
    slug: string;
    country: string;
    currency: string;
}>;
export type Company = z.infer<typeof CompanySchema>;
