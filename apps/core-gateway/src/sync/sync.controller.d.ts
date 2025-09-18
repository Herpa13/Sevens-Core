import { z } from 'zod';
import { ProductSchema } from '@sevens/shared';
declare const VariantSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    sku: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sku: string;
    productId: string;
    id: string;
}, {
    sku: string;
    productId: string;
    id: string;
}>;
export declare class SyncController {
    syncProduct(body: z.infer<typeof ProductSchema>): {
        name: string;
        sku: string;
        status: "Activo" | "En Estudio" | "Inactivo";
        id: number | "new";
        ean?: string | undefined;
        units?: number | undefined;
        asin?: string | undefined;
    };
    syncVariant(body: z.infer<typeof VariantSchema>): {
        sku: string;
        productId: string;
        id: string;
    };
}
export {};
