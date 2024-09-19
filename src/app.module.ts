import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './modules/products/products.module';
import { OrderModule } from './modules/orders/order.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsService } from './modules/products/products.service';
import { CategoriesService } from './modules/categories/categories.service';
import { OrdersService } from './modules/orders/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrderModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProductsService, CategoriesService, OrdersService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    await this.categoriesService.addCategories();
    await this.productsService.addProducts();
  }
}
