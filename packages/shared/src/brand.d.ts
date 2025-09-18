import { z } from 'zod';
export declare const BrandSchema: z.ZodObject<{
    id: z.ZodString;
    companyId: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    companyId: string;
    slug: string;
}, {
    name: string;
    id: string;
    companyId: string;
    slug: string;
}>;
export type Brand = z.infer<typeof BrandSchema>;
