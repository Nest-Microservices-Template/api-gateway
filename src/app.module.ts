import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { KafkaModule } from './transports/kafka.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el ConfigService esté disponible globalmente
    }),
    ProductsModule,
    OrdersModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
