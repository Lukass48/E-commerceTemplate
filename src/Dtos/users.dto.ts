import { ApiHideProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  MaxLength,
  IsEmail,
  MinLength,
  IsString,
  IsNumber,
  Validate,
  IsEmpty,
  Min,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateUserDto {
  /**
   * Debe ser un string de entre 3 y 80 caracteres
   * @example 'Lucas'
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  @Matches(/^[a-zA-Z\s]+$/)
  name: string;

  /**
   * Debe ser un string con un email valido
   * @example 'testuser01@example.com'
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Debe ser un string de entre 8 y 15 caracteres, con al menos una minuscula, una mayuscula y un caracter especial
   * @example 'Password01!'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
  password: string;

  /**
   * Debe ser un string igual al password
   * @example 'Password01!'
   */
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmedPassword: string;

  /**
   * Debe ser un string de entre 3 y 80 caracteres
   * @example 'Test Street 1292'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  @Matches(/^[a-zA-Z0-9\s]+$/)
  address: string;

  /**
   * Debe ser number
   * @example '12345678'
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(9)
  phone: number;

  /**
   * Debe ser un string de entre 4 y 20 caracteres
   * @example 'Fiyi'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z\s]+$/)
  country: string;

  /**
   * Debe ser un string de entre 4 y 20 caracteres
   * @example 'Test City'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z\s]+$/)
  city: string;

  @ApiHideProperty()
  @IsEmpty()
  isAdmin?: boolean;
}
export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
