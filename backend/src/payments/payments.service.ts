import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod } from './payment.entity';
import { Stay } from '../stays/stay.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Stay)
    private stayRepository: Repository<Stay>,
  ) {}

  async createPayment(
    stayId: string,
    amount: number,
    method: PaymentMethod,
    userId: string,
  ): Promise<Payment> {
    const stay = await this.stayRepository.findOne({ where: { id: stayId } });
    
    if (!stay) {
      throw new Error('Stay not found');
    }

    const payment = this.paymentRepository.create({
      stay,
      amount,
      method,
      operator: { id: userId } as any,
    });

    return await this.paymentRepository.save(payment);
  }

  async getAllPayments(skip: number = 0, take: number = 20) {
    const [payments, total] = await this.paymentRepository.findAndCount({
      relations: ['stay', 'stay.vehicle', 'operator'],
      order: { paymentDate: 'DESC' },
      skip,
      take,
    });

    return { payments, total };
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date) {
    return await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.paymentDate >= :startDate', { startDate })
      .andWhere('payment.paymentDate <= :endDate', { endDate })
      .leftJoinAndSelect('payment.stay', 'stay')
      .leftJoinAndSelect('stay.vehicle', 'vehicle')
      .orderBy('payment.paymentDate', 'DESC')
      .getMany();
  }
}
