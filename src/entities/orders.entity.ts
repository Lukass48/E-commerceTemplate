import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { OrderDetails } from './orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MercadoPago } from './mercadoPago.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity({
  name: 'ORDERS',
})
export class Orders {
  @ApiProperty({
    description: 'uuid v4 generado por la base de datos',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Debe ser una fecha del tipo dd/mm/yy',
    example: '2022-01-01',
  })
  @Column()
  date: Date;

  @Column('decimal')
  total: number;

  @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.order, {
    eager: true,
  })
  orderDetails: OrderDetails[];

  @Column({ nullable: true })
  externalReference: string;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToOne(() => MercadoPago, (mercadoPago) => mercadoPago.order, {
    cascade: true,
  })
  payment: MercadoPago; // Agrega esta línea
}
