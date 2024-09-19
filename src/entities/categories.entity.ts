import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Products } from './products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'CATEGORIES',
})
export class Categories {
  @ApiProperty({
    description: 'uuid v4 generado por la base de datos',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nombre de la categoría (máximo 50 caracteres)
   *@example 'Electronics'
   */
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  /**
   * Productos asociados a la categoría
   */
  @OneToMany(() => Products, (product) => product.category)
  @JoinColumn()
  products: Products[];
}
