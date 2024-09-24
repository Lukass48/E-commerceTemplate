import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { MercadoPagoConfig } from 'mercadopago';
import * as dotenv from 'dotenv';
import { MercadoPagoDto } from 'src/Dtos/mercadoPagoDto';
import { OrdersRepository } from '../orders/order.repository';
import { WebhookPayload } from 'src/Dtos/webhookPayload';
import { OrderStatus } from 'src/entities/orders.entity';

dotenv.config();

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  constructor(private readonly ordersRepository: OrdersRepository) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 },
    });
    console.log('MERCADOPAGO_ACCESS_TOKEN loaded');
  }

  async createPaymentPreference(paymentData: MercadoPagoDto) {
    try {
      console.log(
        'Creating payment preference for order ID:',
        paymentData.orderId,
      );

      const order = await this.ordersRepository.findOneWithRelations(
        paymentData.orderId,
        ['orderDetails', 'orderDetails.products'],
      );

      if (!order) {
        console.error('Order not found:', paymentData.orderId);
        throw new NotFoundException('Order not found');
      }

      const transactionAmount = order.total;

      console.log(
        `Transaction amount for order ${paymentData.orderId}: ${transactionAmount}`,
      );

      // Configura los datos de la preferencia de pago para Checkout Pro
      const preferenceData = {
        items: [
          {
            id: paymentData.orderId,
            title: 'Pago de la Orden',
            quantity: 1,
            unit_price: Number(transactionAmount),
          },
        ],
        back_urls: {
          success: 'http://localhost:3001/success',
          failure: 'http://localhost:3001/failure',
          pending: 'http://localhost:3001/pending',
        },
        auto_return: 'approved',
      };

      // Aquí deberías usar el método para crear la preferencia con Checkout Pro.
      const response = await this.createCheckoutProPreference(preferenceData);
      console.log('Payment preference created successfully:', response);

      return { init_point: response.init_point }; // Asegúrate de devolver la URL para redirigir al usuario
    } catch (error) {
      console.error('Error creating payment preference:', error);
      throw new BadRequestException(
        `Error creating payment preference: ${error.message}`,
      );
    }
  }

  private async createCheckoutProPreference(preferenceData) {
    // Llama al endpoint de creación de preferencia de Checkout Pro
    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(preferenceData),
      },
    );
    return response.json();
  }

  async handleWebhook(payload: WebhookPayload) {
    try {
      this.logger.log('Received webhook payload:', payload);

      const { order_id, status } = payload;

      const order = await this.ordersRepository.getOrder(order_id);
      if (!order) {
        throw new BadRequestException('Order not found');
      }

      // Verifica que el estado sea uno de los definidos en OrderStatus
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        throw new BadRequestException(`Invalid status: ${status}`);
      }

      order.status = status as OrderStatus; // Asigna el estado correctamente
      await this.ordersRepository.save(order);

      this.logger.log(`Order ${order_id} updated to status: ${status}`);
    } catch (error) {
      this.logger.error('Error handling webhook:', error);
      throw new BadRequestException(
        `Webhook handling failed: ${error.message}`,
      );
    }
  }
}
