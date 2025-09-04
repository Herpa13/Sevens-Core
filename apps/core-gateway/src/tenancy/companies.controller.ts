import { Body, Controller, Get, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../zod.pipe';
import { randomUUID } from 'crypto';

const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  country: z.string(),
  currency: z.string(),
});

type Company = z.infer<typeof CompanySchema>;

const CompanyCreateSchema = CompanySchema.omit({ id: true });

const companies: Company[] = [];

@Controller('companies')
export class CompaniesController {
  @Get()
  getAll(): Company[] {
    return companies.map((c) => CompanySchema.parse(c));
  }

  @Post()
  create(@Body(new ZodValidationPipe(CompanyCreateSchema)) body: z.infer<typeof CompanyCreateSchema>): Company {
    const company = { id: randomUUID(), ...body };
    companies.push(company);
    return CompanySchema.parse(company);
  }
}
