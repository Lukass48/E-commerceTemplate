import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from 'src/entities/orderDetails.entity';
import { Orders, OrderStatus } from 'src/entities/orders.entity';
import { Products } from 'src/entities/products.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../../Dtos/order.dto';
import { MercadoPago } from 'src/entities/mercadoPago.entity';

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
  ): Promise<{ order: Orders; total: number }> {
    let total = 0;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con id: ${userId} no encontrado.`);
    }

    const order = new Orders();
    order.date = new Date();
    order.total = 0; // Inicializa el total en 0
    order.orderDetails = [];
    order.user = user;

    const newOrder = await this.ordersRepository.save(order);

    for (const element of products) {
      const product = await this.productsRepository.findOne({
        where: { id: element.productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Producto con id: ${element.productId} no encontrado.`,
        );
      }

      if (product.stock < element.quantity) {
        throw new NotFoundException(
          `No hay suficiente stock del producto con id: ${element.productId}`,
        );
      }

      product.stock -= element.quantity; // Restamos el stock
      await this.productsRepository.save(product);

      const orderDetail = new OrderDetails();
      orderDetail.price = Number(product.price) * element.quantity; // Precio total para este detalle
      orderDetail.order = newOrder;
      orderDetail.products = [product];
      orderDetail.quantity = element.quantity;

      newOrder.orderDetails.push(orderDetail);
      total += orderDetail.price; // Sumar el precio total al total de la orden
    }

    newOrder.total = parseFloat(total.toFixed(2)); // Establecer el total como un número, redondeando a 2 decimales
    await this.ordersRepository.save(newOrder);

    const orderWithRelations = await this.ordersRepository.findOne({
      where: { id: newOrder.id },
      relations: ['orderDetails', 'orderDetails.products'],
    });

    orderWithRelations.orderDetails.forEach((orderDetail) => {
      orderDetail.products.forEach((product) => {
        delete product.stock; // Eliminar el stock si es necesario
      });
    });

    return {
      order: orderWithRelations,
      total: newOrder.total,
    };
  }

  async createOrUpdateOrder(orderData: any) {
    try {
      const order = new Orders();

      order.date = orderData.date; // Establecer la fecha del pedido
      order.total = orderData.total; // Establecer el total
      order.user = await this.usersRepository.findOne(orderData.userId); // Asignar el usuario
      order.externalReference = orderData.externalReference || null; // Agregar si es necesario
      order.status = orderData.status || OrderStatus.PENDING;

      if (!order.user) {
        throw new NotFoundException(
          `Usuario con id: ${orderData.userId} no encontrado.`,
        );
      }

      // Crear detalles de pago si es necesario
      if (orderData.paymentId && orderData.status && orderData.amount) {
        const payment = new MercadoPago();
        payment.paymentId = orderData.paymentId;
        payment.status = orderData.status;
        payment.amount = orderData.amount;
        payment.order = order; // Vincular pago al pedido
        order.payment = payment; // Vincular pedido al pago
      }

      // Si tienes detalles de la orden, agrégales
      if (orderData.orderDetails) {
        order.orderDetails = orderData.orderDetails.map((detail) => {
          const orderDetail = new OrderDetails();
          orderDetail.products = detail.product; // Asignar detalles del producto
          orderDetail.quantity = detail.quantity; // Asignar cantidad
          orderDetail.order = order; // Vincular al pedido
          return orderDetail;
        });
      }

      // Guardar el pedido (esto guardará automáticamente el pago y los detalles del pedido)
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new BadRequestException(
        `Error al crear/actualizar el pedido: ${error.message}`,
      );
    }
  }

  async saveOrder(order: Orders) {
    return this.ordersRepository.save(order);
  }

  async getOrder(id: string): Promise<Orders> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'orderDetails.products', 'payment'], // Asegúrate de incluir 'payment' y cualquier otra relación necesaria
    });
    if (!order) {
      throw new NotFoundException(`Orden con id: ${id} no encontrada`);
    }

    return order; // Devuelve el objeto completo de tipo Orders
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

  async findByExternalReference(externalReference: string): Promise<Orders> {
    return this.ordersRepository.findOne({ where: { externalReference } });
  }

  async save(order: Orders): Promise<Orders> {
    return this.ordersRepository.save(order);
  }

  async findOneWithRelations(id: string, relations: string[]): Promise<Orders> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: relations,
    });
  }
}
