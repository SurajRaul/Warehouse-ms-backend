import { ConfigService } from '@nestjs/config';

export const getRabbitMQConfig = (configService: ConfigService) => ({
  transport: 'RMQ' as const,
  options: {
    urls: [
      configService.get<string>(
        'RABBITMQ_URL',
        'amqp://guest:guest@localhost:5672',
      ),
    ],
    queue: 'main_queue',
    queueOptions: {
      durable: true,
    },
    socketOptions: {
      heartbeatIntervalInSeconds: 60,
      reconnectTimeInSeconds: 5,
    },
  },
});

export const QUEUE_NAMES = {
  INVENTORY: 'inventory_queue',
  ORDERS: 'orders_queue',
  PAYMENTS: 'payments_queue',
  SHIPMENTS: 'shipments_queue',
} as const;
