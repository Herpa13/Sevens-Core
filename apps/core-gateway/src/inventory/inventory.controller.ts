import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../zod.pipe';
import {
  StockItemSchema,
  type StockItem,
  InventoryMovementSchema,
  type InventoryMovement,
} from '@sevens/shared';
import { getStock, adjustStock, getMovements } from '@sevens/db';

@Controller()
export class InventoryController {
  @Get('/stock')
  async getAll(): Promise<StockItem[]> {
    return StockItemSchema.array().parse(await getStock());
  }

  @Post('/stock/adjust')
  async adjust(@Body(new ZodValidationPipe(StockItemSchema)) body: StockItem): Promise<StockItem> {
    return StockItemSchema.parse(await adjustStock(body));
  }

  @Get('/inventory/movements')
  async movements(): Promise<InventoryMovement[]> {
    return InventoryMovementSchema.array().parse(await getMovements());
  }
}
