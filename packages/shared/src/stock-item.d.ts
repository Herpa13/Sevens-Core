import { z } from 'zod';
export declare const StockItemSchema: z.ZodObject<{
    warehouseId: z.ZodString;
    variantId: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    warehouseId: string;
    variantId: string;
    quantity: number;
}, {
    warehouseId: string;
    variantId: string;
    quantity: number;
}>;
export type StockItem = z.infer<typeof StockItemSchema>;
