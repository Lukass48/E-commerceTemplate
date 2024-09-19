import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Categories } from 'src/entities/categories.entity';
import { OrderDetails } from 'src/entities/orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'PRODUCTS',
})
export class Products {
  @ApiProperty({
    description: 'uuid v4 generado por la base de datos',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nombre del producto (máximo 50 caracteres)
   * @example 'Laptop'
   */
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  /**
   * Descripción del producto
   * @example 'Una laptop con procesador Intel Core i5 y 8GB de RAM.'
   */
  @Column({ type: 'text', nullable: false })
  description: string;

  /**
   * Precio del producto
   * @example 799.99
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  /**
   * Cantidad disponible en stock
   * @example 100
   */
  @Column({ type: 'int', nullable: false })
  stock: number;

  /**
   * URL de la imagen del producto (por defecto una imagen de error)
   * @example 'https://mi-sitio.com/imagen.jpg'
   */
  @Column({
    type: 'text',
    default:
      'https://static.vecteezy.com/system/resources/previews/004/639/366/original/error-404-not-found-text-design-vector.jpg',
  })
  imgUrl: string;

  /**
   * Categoría a la que pertenece el producto
   */
  @ManyToOne(() => Categories, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  /**
   * Detalles de órdenes relacionados con el producto
   */
  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  orderDetails: OrderDetails[];
}
