import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';
import { Response } from 'express';
import { MercadoPagoDto } from 'src/Dtos/mercadoPagoDto';
import { WebhookPayload } from 'src/Dtos/webhookPayload';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create')
  async createPayment(
    @Body() paymentData: MercadoPagoDto,
    @Res() res: Response,
  ) {
    try {
      const preference =
        await this.mercadoPagoService.createPaymentPreference(paymentData);
      return res.status(HttpStatus.OK).json(preference);
    } catch (error) {
      console.error('Error creating payment preference:', error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('webhook')
  async webhook(@Body() payload: WebhookPayload) {
    await this.mercadoPagoService.handleWebhook(payload);
    return { received: true }; // Respuesta estándar para confirmar la recepción
  }
}
