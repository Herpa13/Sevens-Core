import { z } from 'zod';
import { type Company } from '@sevens/shared';
declare const CompanyCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    country: z.ZodString;
    currency: z.ZodString;
}, "id">, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    country: string;
    currency: string;
}, {
    name: string;
    slug: string;
    country: string;
    currency: string;
}>;
export declare class CompaniesController {
    getAll(): Promise<Company[]>;
    create(body: z.infer<typeof CompanyCreateSchema>): Promise<Company>;
}
export {};
