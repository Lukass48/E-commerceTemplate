import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from 'src/entities/products.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/users/roles.enum';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from '../categories/categories.service';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateProductDto } from 'src/Dtos/products.dto';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async getProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const products = await this.productsService.getProducts(
      Number(page),
      Number(limit),
    );
    return products;
  }

  @Get('seeder')
  addProducts() {
    return this.productsService.addProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Products> {
    return this.productsService.getProduct(id);
  }

  @Post('createProduct')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async createProduct(
    @Body() newProductData: CreateProductDto,
  ): Promise<Products> {
    const categoryName = newProductData.category.name;
    let category = await this.categoriesService.getCategoryByName(categoryName);
    if (!category) {
      category = await this.categoriesService.createCategory(categoryName);
    }

    const newProduct = { ...newProductData, category };
    return this.productsService.newProduct(newProduct);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updatedProduct: Products,
  ) {
    const product = await this.productsService.updateProduct(
      id,
      updatedProduct,
    );
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }
}
