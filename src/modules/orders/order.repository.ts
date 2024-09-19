import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from 'src/entities/orderDetails.entity';
import { Orders } from 'src/entities/orders.entity';
import { Products } from 'src/entities/products.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../../Dtos/order.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async addOrder(
    userId: string,
    products: { productId: string; quantity: number }[],
  ) {
    let total = 0;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id: ${userId} no encontrado.`);
    }

    const order = new Orders();
    order.date = new Date();
    order.total = 0;
    order.orderDetails = [];
    order.user = user;

    const newOrder = await this.ordersRepository.save(order);

    for (const element of products) {
      const product = await this.productsRepository.findOne({
        where: { id: element.productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Producto con id: ${element.productId} no encontrado.,`,
        );
      }
      product.stock = Number(product.stock) - element.quantity;

      await this.productsRepository.save(product);

      total += Number(product.price) * element.quantity;
      if (product.stock < element.quantity) {
        throw new NotFoundException(
          `No hay suficiente stock del producto con id: ${element.productId} `,
        );
      }

      const orderDetail = new OrderDetails();
      orderDetail.price = Number(product.price) * element.quantity;
      orderDetail.order = newOrder;
      orderDetail.products = [product];
      orderDetail.quantity = element.quantity;

      newOrder.orderDetails.push(orderDetail);
    }

    newOrder.total = total;

    await this.ordersRepository.save(newOrder);

    const orderWithRelations = await this.ordersRepository.findOne({
      where: { id: newOrder.id },
      relations: ['orderDetails', 'orderDetails.products'],
    });

    orderWithRelations.orderDetails.forEach((orderDetail) => {
      orderDetail.products.forEach((product) => {
        delete product.stock;
      });
    });

    return {
      order: orderWithRelations,
      total: total.toFixed(2),
    };
  }

  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'orderDetails.products'],
      select: ['id', 'date', 'total', 'user'],
    });
    if (!order) {
      throw new NotFoundException(`Orden con id: ${id} no encontrada `);
    }

    const orderDetail =
      order.orderDetails && Array.isArray(order.orderDetails)
        ? order.orderDetails.map((detail) => ({
            product: detail.products.map((product) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: detail.quantity,
            })),
          }))
        : [];

    return {
      id: order.id,
      date: order.date,
      orderDetail,
      user: order.user,
      total: order.total,
    };
  }

  async validateStock(order: CreateOrderDto): Promise<void> {
    for (const product of order.products) {
      const productInDb = await this.productsRepository.findOne({
        where: { id: product.productId },
      });

      if (!productInDb) {
        throw new Error(
          `No se encontro el producto con la ID: ${product.productId}`,
        );
      }

      if (productInDb.stock < product.quantity) {
        throw new Error(`No hay suficiente stock para ${product.productId}`);
      }
    }
  }

  async findOrdersWithProducts(): Promise<Orders[]> {
    return await this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.orderDetails', 'orderDetails')
      .innerJoinAndSelect('orderDetails.products', 'products')
      .getMany();
  }

  async deleteOrder(orderId: number): Promise<void> {
    const result = await this.ordersRepository.delete(orderId);
    if (result.affected === 0) {
      throw new NotFoundException(`Orden con id: ${orderId} no encontrada`);
    }
  }
}
