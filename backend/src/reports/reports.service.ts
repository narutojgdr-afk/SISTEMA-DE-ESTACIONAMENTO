import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Stay } from '../stays/stay.entity';
import { Payment } from '../payments/payment.entity';
import { ParkingSlot } from '../parking-slots/parking-slot.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Stay)
    private stayRepository: Repository<Stay>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(ParkingSlot)
    private slotRepository: Repository<ParkingSlot>,
  ) {}

  async getRevenueReport(startDate: Date, endDate: Date) {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.paymentDate >= :startDate', { startDate })
      .andWhere('payment.paymentDate <= :endDate', { endDate })
      .getMany();

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    const byMethod = {};
    payments.forEach((p) => {
      if (!byMethod[p.method]) {
        byMethod[p.method] = 0;
      }
      byMethod[p.method] += Number(p.amount);
    });

    return {
      startDate,
      endDate,
      totalRevenue: totalRevenue.toFixed(2),
      totalTransactions: payments.length,
      byMethod,
    };
  }

  async getDailyReport(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const stays = await this.stayRepository
      .createQueryBuilder('stay')
      .where('stay.checkInTime >= :start', { start: startOfDay })
      .andWhere('stay.checkInTime <= :end', { end: endOfDay })
      .leftJoinAndSelect('stay.vehicle', 'vehicle')
      .leftJoinAndSelect('stay.slot', 'slot')
      .getMany();

    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.paymentDate >= :start', { start: startOfDay })
      .andWhere('payment.paymentDate <= :end', { end: endOfDay })
      .getMany();

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      date: date.toISOString().split('T')[0],
      totalCheckIns: stays.length,
      totalCheckOuts: stays.filter(s => s.checkOutTime).length,
      totalRevenue: totalRevenue.toFixed(2),
      totalTransactions: payments.length,
    };
  }

  async getOccupancyHistory(startDate: Date, endDate: Date) {
    const stays = await this.stayRepository
      .createQueryBuilder('stay')
      .where('stay.checkInTime >= :startDate', { startDate })
      .andWhere('stay.checkInTime <= :endDate', { endDate })
      .leftJoinAndSelect('stay.vehicle', 'vehicle')
      .leftJoinAndSelect('stay.slot', 'slot')
      .orderBy('stay.checkInTime', 'ASC')
      .getMany();

    return stays;
  }
}
