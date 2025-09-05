import { Body, Controller, Get, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../zod.pipe';
import { randomUUID } from 'crypto';
import { BrandSchema, type Brand } from '@sevens/shared';
import { getBrands, addBrand } from '@sevens/db';

const BrandCreateSchema = BrandSchema.omit({ id: true });

@Controller('brands')
export class BrandsController {
  @Get()
  async getAll(): Promise<Brand[]> {
    return BrandSchema.array().parse(await getBrands());
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(BrandCreateSchema)) body: z.infer<typeof BrandCreateSchema>,
  ): Promise<Brand> {
    const brand = { id: randomUUID(), ...body };
    await addBrand(brand);
    return BrandSchema.parse(brand);
  }
}
