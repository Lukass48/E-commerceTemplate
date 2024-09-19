import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Products } from './products.entity';
import { Orders } from './orders.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'ORDERDETAILS',
})
export class OrderDetails {
  @ApiProperty({
    description: 'uuid v4 generado por la base de datos',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Precio total de los productos en los detalles de la orden
   * @example $12.99
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * Orden a la que pertenecen estos detalles
   */
  @ManyToOne(() => Orders, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Orders;

  @Column('int', { default: 1 })
  quantity: number;

  /**
   * Productos incluidos en estos detalles de la orden
   */
  @ManyToMany(() => Products)
  @JoinTable({
    name: 'ORDERDETAILS_PRODUCTS',
    joinColumn: {
      name: 'orderdetail_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Products[];
}
