import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
export interface MessagePayload {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  correlationId?: string;
}
@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.connection;
  private channel: amqp.channel;
  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    await this.connect();
  }
  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      const url = this.configService.get<string>('RABBITMQ_URL');
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      console.log('✅ RabbitMQ connected successfully to', url);
    } catch (err) {
      throw err;
    }
  }

  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (err) {}
  }

  async publishMessage(queue: string, message: MessagePayload): Promise<void> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      const messageBuffer = Buffer.from(JSON.stringify(message));
      this.channel.sendToQueue(queue, messageBuffer, {
        persistent: true,
        correlationId: message.correlationId,
        timestamp: Date.now(),
      });
    } catch (err) {
      throw err;
    }
  }

  async consumeMessage(
    queue: string,
    handler: (message: MessagePayload) => Promise<void>,
  ): Promise<void> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      // It limits the number of unacknowledged messages that the consumer can receive at a time to 1.
      await this.channel.prefetch(1);
      await this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const messagePayload: MessagePayload = JSON.parse(
              msg.content.toString(),
            );
            await handler(messagePayload);
            this.channel.ack(msg);
          } catch (error) {
            this.channel.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async publishInventoryUpdate(data: any): Promise<void> {
    const message: MessagePayload = {
      id: `inventory-${Date.now()}`,
      type: 'INVENTORY UPDATE',
      data,
      timestamp: new Date(),
    };

    await this.publishMessage('inventory_queue', message);
  }
  async publishOrderUpdate() {}
  async publishPaymentUpdate() {}
  async publishShipmentUpdate() {}
}
