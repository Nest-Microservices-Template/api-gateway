import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject('KAFKA_CLIENT') private readonly client: ClientKafka) {}

  async onModuleInit() {
    const replyTopics = [
      'find_all_products',
      'create_product',
      'find_one_product',
      'createOrder',
      'findOneOrder',
      'findAllOrders',
      'changeOrderStatusTopic',
      'validate_products',
    ];

    replyTopics.forEach((topic) => {
      this.client.subscribeToResponseOf(`${topic}`);
    });

    await this.client.connect();
  }

  async sendMessage(topic: string, message: any) {
    return this.client.emit(topic, JSON.stringify(message));
  }

  async sendAndReceive<T>(topic: string, message: any): Promise<T> {
    return lastValueFrom(
      this.client.send(topic, JSON.stringify(message)).pipe(
        timeout(5000), // ⏳ Falla después de 5 segundos si no hay respuesta
      ),
    );
  }
}
