import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('seeder')
  addCategories() {
    return this.categoriesService.addCategories();
  }

  @Get('/')
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Get(':name')
  async getCategoryByName(@Param('name') name: string) {
    return this.categoriesService.getCategoryByName(name);
  }
}
