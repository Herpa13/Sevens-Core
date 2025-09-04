import { z } from 'zod';

export const InventoryMovementSchema = z.object({
  id: z.string(),
  stockItemId: z.string(),
  type: z.enum(['ADJUSTMENT']),
  quantity: z.number(),
  createdAt: z.date(),
});

export type InventoryMovement = z.infer<typeof InventoryMovementSchema>;
