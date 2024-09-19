import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/data.json';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Products[]> {
    const start = (page - 1) * limit;

    return await this.productsRepository.find({
      relations: ['category'],
      skip: start,
      take: limit,
    });
  }

  async getProduct(id: string): Promise<Products> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async addProduct() {
    for (const products of data) {
      const category = await this.categoriesRepository.findOne({
        where: { name: products.category },
      });
      const product = new Products();
      product.name = products.name;
      product.description = products.description;
      product.price = products.price;
      product.imgUrl = products.imgUrl;
      product.stock = products.stock;
      product.category = category;
      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Products)
        .values(product)
        .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
        .execute();
    }
    return 'productos agregados';
  }

  async createProduct(newProductData: Partial<Products>): Promise<Products> {
    const categoryName = newProductData.category.name;

    let category = await this.categoriesRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      category = this.categoriesRepository.create({ name: categoryName });
      category = await this.categoriesRepository.save(category);
    }

    const existingProduct = await this.productsRepository.findOne({
      where: { name: newProductData.name },
    });

    if (existingProduct) {
      existingProduct.stock += newProductData.stock || 0;
      return await this.productsRepository.save(existingProduct);
    } else {
      const newProduct = this.productsRepository.create({
        ...newProductData,
        category,
      });
      return await this.productsRepository.save(newProduct);
    }
  }

  async updateProduct(
    id: string,
    productData: Partial<Products>,
  ): Promise<Products> {
    await this.productsRepository.update(id, productData);
    const updatedProduct = await this.productsRepository.findOneBy({ id });
    return updatedProduct;
  }

  async deleteProducts(): Promise<void> {
    await this.productsRepository.createQueryBuilder().delete().execute();
  }
}
