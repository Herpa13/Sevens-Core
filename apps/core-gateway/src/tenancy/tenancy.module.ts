import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { BrandsController } from './brands.controller';

@Module({
  controllers: [CompaniesController, BrandsController],
})
export class TenancyModule {}
