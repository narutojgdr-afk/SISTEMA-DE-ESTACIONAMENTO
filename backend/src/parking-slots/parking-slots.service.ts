import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingSlot } from './parking-slot.entity';
import { VehicleType } from '../vehicles/vehicle.entity';

@Injectable()
export class ParkingSlotsService {
  constructor(
    @InjectRepository(ParkingSlot)
    private slotRepository: Repository<ParkingSlot>,
  ) {}

  async createSlot(number: string, type: VehicleType): Promise<ParkingSlot> {
    const slot = this.slotRepository.create({ number, type });
    return await this.slotRepository.save(slot);
  }

  async getAllSlots(): Promise<ParkingSlot[]> {
    return await this.slotRepository.find({ order: { number: 'ASC' } });
  }

  async getOccupancy() {
    const total = await this.slotRepository.count({ where: { isActive: true } });
    const occupied = await this.slotRepository.count({
      where: { isActive: true, isOccupied: true },
    });
    const available = total - occupied;

    const byType = await Promise.all(
      [VehicleType.CAR, VehicleType.MOTO, VehicleType.PCD].map(async (type) => {
        const typeTotal = await this.slotRepository.count({
          where: { type, isActive: true },
        });
        const typeOccupied = await this.slotRepository.count({
          where: { type, isActive: true, isOccupied: true },
        });
        return {
          type,
          total: typeTotal,
          occupied: typeOccupied,
          available: typeTotal - typeOccupied,
        };
      }),
    );

    return {
      total,
      occupied,
      available,
      occupancyRate: total > 0 ? ((occupied / total) * 100).toFixed(2) : '0',
      byType,
    };
  }

  async updateSlot(id: string, data: Partial<ParkingSlot>): Promise<ParkingSlot> {
    await this.slotRepository.update(id, data);
    return await this.slotRepository.findOne({ where: { id } });
  }

  async deleteSlot(id: string): Promise<void> {
    await this.slotRepository.update(id, { isActive: false });
  }
}
