import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MercadoPago } from 'src/entities/mercadoPago.entity';
import { Orders } from 'src/entities/orders.entity';
import { MercadoPagoRepository } from './mercadoPago.repository';
import { MercadoPagoService } from './mercadoPago.service';
import { MercadoPagoController } from './mercadoPago.controller';
import { OrdersRepository } from '../orders/order.repository';
import { UsersRepository } from '../users/users.repository';
import { Users } from 'src/entities/users.entity';
import { Products } from 'src/entities/products.entity';
import { ProductRepository } from '../products/products.repository';
import { Categories } from 'src/entities/categories.entity';
import { OrdersService } from '../orders/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MercadoPago,
      Orders,
      Users,
      Products,
      Categories,
    ]),
  ],
  controllers: [MercadoPagoController],
  providers: [
    MercadoPagoRepository,
    MercadoPagoService,
    OrdersRepository,
    UsersRepository,
    ProductRepository,
    OrdersService,
  ],
})
export class MercadoPagoModule {}
