import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../zod.pipe';
import { ProductSchema } from '@sevens/shared';

const VariantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  sku: z.string(),
});

@Controller('sync/pim')
export class SyncController {
  @Post('product')
  syncProduct(@Body(new ZodValidationPipe(ProductSchema)) body: z.infer<typeof ProductSchema>) {
    return ProductSchema.parse(body);
  }

  @Post('variant')
  syncVariant(@Body(new ZodValidationPipe(VariantSchema)) body: z.infer<typeof VariantSchema>) {
    return VariantSchema.parse(body);
  }
}
