import { Body, Controller, Get, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../zod.pipe';
import { randomUUID } from 'crypto';

const StockItemSchema = z.object({
  warehouseId: z.string(),
  variantId: z.string(),
  quantity: z.number(),
});

const AdjustSchema = StockItemSchema;

const InventoryMovementSchema = z.object({
  id: z.string(),
  stockItemId: z.string(),
  type: z.enum(['ADJUSTMENT']),
  quantity: z.number(),
  createdAt: z.date(),
});

type StockItem = z.infer<typeof StockItemSchema>;
type InventoryMovement = z.infer<typeof InventoryMovementSchema>;

const stock: Record<string, StockItem> = {};
const movements: InventoryMovement[] = [];

@Controller()
export class InventoryController {
  @Get('/stock')
  getStock(): StockItem[] {
    return Object.values(stock).map((s) => StockItemSchema.parse(s));
  }

  @Post('/stock/adjust')
  adjust(@Body(new ZodValidationPipe(AdjustSchema)) body: StockItem): StockItem {
    const key = `${body.warehouseId}:${body.variantId}`;
    const current = stock[key] || { warehouseId: body.warehouseId, variantId: body.variantId, quantity: 0 };
    current.quantity += body.quantity;
    stock[key] = current;
    const movement: InventoryMovement = {
      id: randomUUID(),
      stockItemId: key,
      type: 'ADJUSTMENT',
      quantity: body.quantity,
      createdAt: new Date(),
    };
    movements.push(movement);
    return StockItemSchema.parse(current);
  }

  @Get('/inventory/movements')
  getMovements(): InventoryMovement[] {
    return movements.map((m) => InventoryMovementSchema.parse(m));
  }
}
