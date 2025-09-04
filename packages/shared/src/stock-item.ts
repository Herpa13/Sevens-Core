import { z } from 'zod';

export const StockItemSchema = z.object({
  warehouseId: z.string(),
  variantId: z.string(),
  quantity: z.number(),
});

export type StockItem = z.infer<typeof StockItemSchema>;
