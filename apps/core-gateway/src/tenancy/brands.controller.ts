import { Body, Controller, Get, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../zod.pipe';
import { randomUUID } from 'crypto';

const BrandSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string(),
  slug: z.string(),
});

type Brand = z.infer<typeof BrandSchema>;

const BrandCreateSchema = BrandSchema.omit({ id: true });

const brands: Brand[] = [];

@Controller('brands')
export class BrandsController {
  @Get()
  getAll(): Brand[] {
    return brands.map((b) => BrandSchema.parse(b));
  }

  @Post()
  create(@Body(new ZodValidationPipe(BrandCreateSchema)) body: z.infer<typeof BrandCreateSchema>): Brand {
    const brand = { id: randomUUID(), ...body };
    brands.push(brand);
    return BrandSchema.parse(brand);
  }
}
