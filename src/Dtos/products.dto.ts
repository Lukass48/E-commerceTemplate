import { PickType } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
export class ProductDto {
  /**
   * UUID único del producto
   * @example 1
   */
  @IsNotEmpty()
  @IsUUID()
  id: string;

  /**
   * Nombre del producto (entre 3 y 80 caracteres)
   * @example 'Producto de ejemplo'
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s-]+$/, { message: 'Nombre invalido' })
  @MinLength(3)
  @MaxLength(80)
  name: string;

  /**
   * Precio del producto
   * @example 19.99
   */
  @IsNotEmpty()
  @IsNumber()
  price: number;

  /**
   * Descripción del producto (entre 10 y 1000 caracteres)
   * @example 'Este es un producto de ejemplo...'
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s.,-]+$/, { message: 'Descripcion invalida' })
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  /**
   * Cantidad disponible en stock (número entero positivo)
   * @example 100
   */
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;
  /**
   * Cantidad del producto en una orden
   * @example 5
   */
  @IsInt()
  @Min(1)
  @Max(1000)
  quantity: number;

  /**
   * Calificación del producto (número entre 1 y 5)
   * @example 4
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rate: number;

  /**
   * URL de la imagen del producto
   * @example 'https://example.com/image.jpg'
   */
  @IsNotEmpty()
  @IsUrl()
  @Matches(/^https?:\/\/[^\s]+$/, { message: 'URl de la imagen invalida' })
  imgUrl: string;
}
export class CreateProductDto extends PickType(ProductDto, [
  'description',
  'imgUrl',
  'name',
  'price',
  'stock',
]) {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @IsNotEmpty()
  category: { name: string };
}
