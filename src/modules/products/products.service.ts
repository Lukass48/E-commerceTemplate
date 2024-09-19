import { Injectable } from '@nestjs/common';
import { Products } from 'src/entities/products.entity';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}
  async getProducts(page: number, limit: number): Promise<Products[]> {
    const products = await this.productRepository.getProducts(page, limit);
    return products;
  }

  getProduct(id: string) {
    return this.productRepository.getProduct(id);
  }
  addProducts() {
    return this.productRepository.addProduct();
  }

  async newProduct(newProductData: Partial<Products>): Promise<Products> {
    return await this.productRepository.createProduct(newProductData);
  }
  updateProduct(id: string, updatedProduct: Products) {
    return this.productRepository.updateProduct(id, updatedProduct);
  }

  async resetProducts(): Promise<void> {
    await this.productRepository.deleteProducts();
  }
}
