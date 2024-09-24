import { IsNotEmpty, IsString } from 'class-validator';

export class WebhookPayload {
  @IsString()
  @IsNotEmpty()
  action: string; // Acción del webhook (por ejemplo, "payment.created")

  @IsString()
  @IsNotEmpty()
  order_id: string; // ID de la orden asociada

  @IsString()
  @IsNotEmpty()
  status: string; // Estado del pago (por ejemplo, "approved", "pending", "rejected")
}
