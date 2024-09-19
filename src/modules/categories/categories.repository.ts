import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../../entities/categories.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/data.json';

console.log(data);

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories() {
    return await this.categoriesRepository.find();
  }

  async createCategory(name: string): Promise<Categories> {
    const category = new Categories();
    category.name = name;
    return await this.categoriesRepository.save(category);
  }

  async addCategories() {
    if (!Array.isArray(data)) {
      console.log('Is Array:', Array.isArray(data));
      throw new Error('Data is not an array');
    }
    for (const element of data) {
      await this.categoriesRepository
        .createQueryBuilder()
        .insert()
        .into(Categories)
        .values({ name: element.category })
        .orIgnore()
        .execute();
    }
    return 'Categorias Agregadas';
  }
  async getCategoryByName(name: string) {
    return await this.categoriesRepository.findOneBy({ name });
  }

  async clearCategories(): Promise<void> {
    await this.categoriesRepository.clear();
  }
}
