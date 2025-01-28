import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { KafkaModule } from '../transports/kafka.module';
import { KafkaProducerService } from '../transports/kafka-producer.service';

@Module({
  controllers: [OrdersController],
  providers: [KafkaProducerService],
  imports: [KafkaModule],
})
export class OrdersModule {}
