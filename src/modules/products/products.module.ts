import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { Categories } from 'src/entities/categories.entity';
import { CategoriesModule } from '../categories/categories.module';
import { OrderModule } from '../orders/order.module';
import { ProductRepository } from './products.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Categories]),
    CategoriesModule,
    OrderModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository],
  exports: [ProductRepository, ProductsService],
})
export class ProductsModule {}
