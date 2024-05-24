import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE } from '../config/services';
import { envs } from '../config/envs';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.ordersMicroservicesHost,
          port: envs.ordersMicroservicesPort,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
