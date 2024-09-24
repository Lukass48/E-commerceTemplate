import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  // OneToMany,
  // JoinColumn,
} from 'typeorm';
// import { Orders } from 'src/entities/orders.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/users/roles.enum';
import { Orders } from './orders.entity';

@Entity({
  name: 'USERS',
})
export class Users {
  @ApiProperty({
    description: 'uuid v4 generado por la base de datos',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nombre del usuario (máximo 50 caracteres)
   * @example 'Test User01'
   */
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  /**
   * Correo electrónico del usuario (máximo 50 caracteres, único)
   * @example 'testuser01@example.com'
   */
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  /**
   * Debe ser un string de entre 8 y 15 caracteres, con al menos una minuscula, una mayuscula y un caracter especial
   * @example 'Password01!'
   */
  @Column({ type: 'varchar', length: 80, nullable: false })
  password: string;

  /**
   * Debe ser number
   * @example '12345678'
   */
  @Column({ type: 'int' })
  phone: number;

  /**
   * Debe ser un string de entre 4 y 20 caracteres
   * @example 'Fiyi'
   */
  @Column({ type: 'varchar', length: 50 })
  country: string;

  /**
   * Debe ser un string de entre 3 y 80 caracteres
   * @example 'Test Street 1292'
   */
  @Column({ type: 'text' })
  address: string;

  /**
   * Debe ser un string de entre 4 y 20 caracteres
   * @example 'Test City'
   */
  @Column({ type: 'varchar', length: 50 })
  city: string;
  /**
   * Órdenes realizadas por el usuario
   */
  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'order_id' })
  orders: Orders[];
  /**
   * Indica si el rol del usuario
   */
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Guest, // O el rol por defecto que prefieras
  })
  role: Role;

  /**
   * Indica si el correo electrónico del usuario ha sido verificado.
   * @example 'true'
   */
  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;
}
