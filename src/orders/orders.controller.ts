import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ORDER_SERVICE } from '../config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderRequestDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '../common/dto/pagination.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() createOrderrDto: CreateOrderRequestDto) {
    return this.ordersClient.send('createOrder', createOrderrDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const product = await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  findAllOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }
}
