import { Body, Controller, Get, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../zod.pipe';
import { randomUUID } from 'crypto';
import { CompanySchema, type Company } from '@sevens/shared';
import { getCompanies, addCompany } from '@sevens/db';

const CompanyCreateSchema = CompanySchema.omit({ id: true });

@Controller('companies')
export class CompaniesController {
  @Get()
  async getAll(): Promise<Company[]> {
    return getCompanies();
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CompanyCreateSchema))
    body: z.infer<typeof CompanyCreateSchema>,
  ): Promise<Company> {
    const company = { id: randomUUID(), ...body };
    await addCompany(company);
    return company;
  }
}
