import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { KafkaModule } from '../transports/kafka.module';
import { KafkaProducerService } from '../transports/kafka-producer.service';

@Module({
  controllers: [ProductsController],
  providers: [KafkaProducerService],
  imports: [KafkaModule],
})
export class ProductsModule {}
