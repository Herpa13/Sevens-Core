import { z } from 'zod';
export declare const InventoryMovementSchema: z.ZodObject<{
    id: z.ZodString;
    stockItemId: z.ZodString;
    type: z.ZodEnum<["ADJUSTMENT"]>;
    quantity: z.ZodNumber;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    type: "ADJUSTMENT";
    id: string;
    createdAt: Date;
    quantity: number;
    stockItemId: string;
}, {
    type: "ADJUSTMENT";
    id: string;
    createdAt: Date;
    quantity: number;
    stockItemId: string;
}>;
export type InventoryMovement = z.infer<typeof InventoryMovementSchema>;
