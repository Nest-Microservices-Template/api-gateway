import { Controller, Inject } from '@nestjs/common';
import { ORDER_SERVICE } from '../config/services';
import { ClientProxy } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}
}
