import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Categories } from 'src/entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  addCategories() {
    return this.categoriesRepository.addCategories();
  }

  async createCategory(name: string): Promise<Categories> {
    return await this.categoriesRepository.createCategory(name);
  }

  getCategories() {
    return this.categoriesRepository.getCategories();
  }

  getCategoryByName(name: string) {
    return this.categoriesRepository.getCategoryByName(name);
  }

  async resetCategories() {
    await this.categoriesRepository.clearCategories();
    return this.addCategories();
  }
}
