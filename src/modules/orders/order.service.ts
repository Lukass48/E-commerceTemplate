import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './order.repository';
import { CreateOrderDto } from '../../Dtos/order.dto';
import { Orders, OrderStatus } from 'src/entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository) {}

  addOrder(userId: string, products: any) {
    return this.ordersRepository.addOrder(userId, products);
  }

  async getOrder(id: string): Promise<Orders> {
    return this.ordersRepository.getOrder(id);
  }

  validateStock(order: CreateOrderDto): Promise<void> {
    return this.ordersRepository.validateStock(order);
  }

  async getOrdersWithOrderDetails(): Promise<Orders[]> {
    return this.ordersRepository.findOrdersWithProducts();
  }

  async deleteOrder(orderId: number): Promise<void> {
    await this.ordersRepository.deleteOrder(orderId);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.getOrder(orderId);
    order.status = status;
    await this.ordersRepository.save(order);
  }

  // Nuevo: Buscar orden por external_reference
  async findOrderByExternalReference(
    externalReference: string,
  ): Promise<Orders> {
    return this.ordersRepository.findByExternalReference(externalReference);
  }
}
