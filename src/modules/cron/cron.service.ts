import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RabbitmqService } from 'src/shared/rabbitmq/rabbitmq.service';

@Injectable()
export class CronService {
  constructor(private rabbitmqService: RabbitmqService) {}

  // @Cron(CronExpression.EVERY_MINUTE)
  async checkLowStockItems() {
    try {
      console.log('Cron job running every minute');
    } catch (err) {
      console.error('Error in cron job:', err);
    }
  }
}
