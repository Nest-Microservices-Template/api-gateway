import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { KafkaProducerService } from '../transports/kafka-producer.service';
import { RpcException } from '@nestjs/microservices';
import { GetProductsResponseDto } from './dto/get-products.response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductRequestDto) {
    try {
      const response = await this.kafkaProducerService.sendAndReceive(
        'create_product',
        createProductDto,
      );
      return response; // Devolver la respuesta del microservicio al cliente
    } catch (error) {
      console.error('Error en Kafka:', error);
      throw new RpcException({
        statusCode: 504,
        message: 'El servicio de productos no está disponible en este momento.',
      });
    }
  }

  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto) {
    // Enviar mensaje al topic `findAllOrders` con los datos de paginación
    const products =
      await this.kafkaProducerService.sendAndReceive<GetProductsResponseDto>(
        'find_all_products', // Nombre del topic
        paginationDto, // Payload del mensaje
      );

    return products; // Devolver la respuesta del microservicio
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      // Enviar mensaje al topic `findOneOrder` con el ID solicitado
      const product = await this.kafkaProducerService.sendAndReceive(
        'find_one_product', // Nombre del topic
        { id }, // Payload del mensaje
      );

      return product; // Devolver la respuesta del microservicio
    } catch (error) {
      throw new RpcException(error.message || 'Error fetching order');
    }
  }
}
