import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrderRequestDto } from './dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { StatusDto } from './dto/status.dto';
import { KafkaProducerService } from '../transports/kafka-producer.service';
import { RpcException } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderRequestDto) {
    // Enviar mensaje al topic `createOrderTopic` y esperar respuesta
    const response = await this.kafkaProducerService.sendAndReceive(
      'createOrder',
      createOrderDto,
    );
    return response; // Devolver la respuesta del microservicio al cliente
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      // Enviar mensaje al topic `findOneOrder` con el ID solicitado
      const product = await this.kafkaProducerService.sendAndReceive(
        'findOneOrder', // Nombre del topic
        { id }, // Payload del mensaje
      );

      return product; // Devolver la respuesta del microservicio
    } catch (error) {
      throw new RpcException(error.message || 'Error fetching order');
    }
  }

  @Get()
  async findAllOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      // Enviar mensaje al topic `findAllOrders` con los datos de paginación
      const orders = await this.kafkaProducerService.sendAndReceive(
        'findAllOrders', // Nombre del topic
        orderPaginationDto, // Payload del mensaje
      );

      return orders; // Devolver la respuesta del microservicio
    } catch (error) {
      throw new RpcException(error.message || 'Error fetching orders');
    }
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      // Enviar mensaje al topic `changeOrderStatusTopic` y esperar respuesta
      const response = await this.kafkaProducerService.sendAndReceive(
        'changeOrderStatusTopic',
        {
          id,
          status: statusDto.status,
        },
      );

      return response; // Devolver la respuesta del microservicio al cliente
    } catch (error) {
      // Manejar errores y lanzar excepciones si es necesario
      throw new Error(
        error.message || 'Error processing the change order status request',
      );
    }
  }
}
