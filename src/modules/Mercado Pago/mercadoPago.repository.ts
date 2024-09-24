import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MercadoPago } from 'src/entities/mercadoPago.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MercadoPagoRepository {
  constructor(
    @InjectRepository(MercadoPago)
    private readonly mercadoPagoRepository: Repository<MercadoPago>,
  ) {}

  async createPayment(paymentData: Partial<MercadoPago>): Promise<MercadoPago> {
    const payment = this.mercadoPagoRepository.create(paymentData);
    return this.mercadoPagoRepository.save(payment);
  }

  async getPaymentById(paymentId: string): Promise<MercadoPago> {
    return this.mercadoPagoRepository.findOne({ where: { paymentId } });
  }
}
