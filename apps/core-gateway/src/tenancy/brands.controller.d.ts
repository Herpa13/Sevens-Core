import { z } from 'zod';
import { type Brand } from '@sevens/shared';
declare const BrandCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    companyId: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
}, "id">, "strip", z.ZodTypeAny, {
    name: string;
    companyId: string;
    slug: string;
}, {
    name: string;
    companyId: string;
    slug: string;
}>;
export declare class BrandsController {
    getAll(): Promise<Brand[]>;
    create(body: z.infer<typeof BrandCreateSchema>): Promise<Brand>;
}
export {};
