import { Injectable } from '@nestjs/common';
import { InventoryService } from '../inventory/inventory.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(
    private inventoryService: InventoryService,
    private orderService: OrdersService,
    private userService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkLowStockItems() {
    try {
      const lowStockItems = this.inventoryService.findLowStockItems();
      if (lowStockItems.length > 0) {
      }
    } catch (err) {}
  }
}
