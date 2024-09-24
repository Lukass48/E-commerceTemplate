import { IsNotEmpty, IsString } from 'class-validator';

export class MercadoPagoDto {
  @IsString()
  @IsNotEmpty()
  orderId: string; // ID de la reserva, si aplica
}
