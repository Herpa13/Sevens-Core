import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TenancyModule } from './tenancy/tenancy.module';
import { SyncModule } from './sync/sync.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [TenancyModule, SyncModule, InventoryModule],
  controllers: [HealthController],
})
export class AppModule {}
