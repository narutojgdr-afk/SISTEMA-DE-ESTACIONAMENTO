import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  async getAllVehicles(skip: number = 0, take: number = 20) {
    const [vehicles, total] = await this.vehicleRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { vehicles, total };
  }

  async getVehicleByPlate(plate: string): Promise<Vehicle> {
    return await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase() },
      relations: ['stays', 'subscriptions'],
    });
  }

  async searchVehicles(query: string) {
    return await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where('UPPER(vehicle.plate) LIKE UPPER(:query)', { query: `%${query}%` })
      .orWhere('UPPER(vehicle.model) LIKE UPPER(:query)', { query: `%${query}%` })
      .orWhere('UPPER(vehicle.color) LIKE UPPER(:query)', { query: `%${query}%` })
      .orderBy('vehicle.createdAt', 'DESC')
      .take(20)
      .getMany();
  }
}
