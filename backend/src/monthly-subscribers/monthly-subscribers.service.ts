import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { MonthlySubscriber } from './monthly-subscriber.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Injectable()
export class MonthlySubscribersService {
  constructor(
    @InjectRepository(MonthlySubscriber)
    private subscriberRepository: Repository<MonthlySubscriber>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  async createSubscriber(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
    monthlyFee: number,
  ): Promise<MonthlySubscriber> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
    
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const subscriber = this.subscriberRepository.create({
      vehicle,
      startDate,
      endDate,
      monthlyFee,
    });

    return await this.subscriberRepository.save(subscriber);
  }

  async getAllSubscribers(skip: number = 0, take: number = 20) {
    const [subscribers, total] = await this.subscriberRepository.findAndCount({
      relations: ['vehicle'],
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { subscribers, total };
  }

  async getActiveSubscribers() {
    const now = new Date();
    return await this.subscriberRepository.find({
      where: {
        isActive: true,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      relations: ['vehicle'],
    });
  }

  async checkIfSubscriberActive(vehicleId: string): Promise<boolean> {
    const now = new Date();
    const activeSubscription = await this.subscriberRepository.findOne({
      where: {
        vehicle: { id: vehicleId },
        isActive: true,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
    });

    return !!activeSubscription;
  }

  async updateSubscriber(id: string, data: Partial<MonthlySubscriber>): Promise<MonthlySubscriber> {
    await this.subscriberRepository.update(id, data);
    return await this.subscriberRepository.findOne({
      where: { id },
      relations: ['vehicle'],
    });
  }

  async deleteSubscriber(id: string): Promise<void> {
    await this.subscriberRepository.update(id, { isActive: false });
  }
}
