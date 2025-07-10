import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { InventoryModule } from '../inventory/inventory.module';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [InventoryModule, OrdersModule, UsersModule],
  providers: [CronService],
})
export class CronModule {}
