import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

class ProductInOrder {
  /**
   * UUID del producto en la orden
   * @example '1d3ca24c-236b-457d-b04f-f5fd73db94be'
   */
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  /**
   * Cantidad del producto en la orden
   * @example 3
   */
  @IsInt()
  @Min(1, { message: 'Debe haber minimo 1' })
  quantity: number;
}
export class CreateOrderDto {
  /**
   * UUID del usuario que realiza la orden
   * @example '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsNotEmpty()
  @IsUUID()
  @Matches(/^[a-zA-Z0-9-]+$/, { message: 'ID invalida' })
  userId: string;
  /**
   * Array de productos en la orden
   * @example [{ productId: '1d3ca24c-236b-457d-b04f-f5fd73db94be' }, { productId: '220dcb3d-952f-4b16-a022-906d0b844a01' }]
   */
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  products: ProductInOrder[];
}
