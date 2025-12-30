import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stay, StayStatus } from './stay.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { ParkingSlot } from '../parking-slots/parking-slot.entity';
import { PricingService } from '../pricing/pricing.service';
import { MonthlySubscribersService } from '../monthly-subscribers/monthly-subscribers.service';
import { CheckInDto, CheckOutDto } from './dto/stay.dto';

@Injectable()
export class StaysService {
  constructor(
    @InjectRepository(Stay)
    private stayRepository: Repository<Stay>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ParkingSlot)
    private slotRepository: Repository<ParkingSlot>,
    private pricingService: PricingService,
    @Inject(forwardRef(() => MonthlySubscribersService))
    private subscribersService: MonthlySubscribersService,
  ) {}

  async checkIn(dto: CheckInDto, userId: string): Promise<Stay> {
    // Find or create vehicle
    let vehicle = await this.vehicleRepository.findOne({
      where: { plate: dto.plate.toUpperCase() },
    });

    if (!vehicle) {
      vehicle = this.vehicleRepository.create({
        plate: dto.plate.toUpperCase(),
        type: dto.vehicleType,
        model: dto.model,
        color: dto.color,
      });
      vehicle = await this.vehicleRepository.save(vehicle);
    }

    // Check if vehicle already has an active stay
    const activeStay = await this.stayRepository.findOne({
      where: {
        vehicle: { id: vehicle.id },
        status: StayStatus.ACTIVE,
      },
    });

    if (activeStay) {
      throw new BadRequestException('Vehicle already has an active stay');
    }

    // Find available slot of the same type
    const availableSlot = await this.slotRepository.findOne({
      where: {
        type: dto.vehicleType,
        isOccupied: false,
        isActive: true,
      },
    });

    if (!availableSlot) {
      throw new BadRequestException(`No available ${dto.vehicleType} slots`);
    }

    // Mark slot as occupied
    availableSlot.isOccupied = true;
    await this.slotRepository.save(availableSlot);

    // Create stay
    const stay = this.stayRepository.create({
      vehicle,
      slot: availableSlot,
      checkInTime: new Date(),
      status: StayStatus.ACTIVE,
      operator: { id: userId } as any,
    });

    return await this.stayRepository.save(stay);
  }

  async checkOut(dto: CheckOutDto, userId: string): Promise<Stay> {
    const stay = await this.stayRepository.findOne({
      where: { id: dto.stayId },
      relations: ['vehicle', 'slot', 'operator'],
    });

    if (!stay) {
      throw new NotFoundException('Stay not found');
    }

    if (stay.status === StayStatus.COMPLETED) {
      throw new BadRequestException('Stay already completed');
    }

    const checkOutTime = new Date();
    let calculatedFee = 0;

    // Check if vehicle has an active monthly subscription
    const isMonthlySubscriber = await this.subscribersService.checkIfSubscriberActive(stay.vehicle.id);

    if (isMonthlySubscriber) {
      // Monthly subscribers skip per-stay charges
      calculatedFee = 0;
    } else {
      // Calculate fee for non-subscribers
      const calculation = await this.pricingService.calculateFee({
        checkInTime: stay.checkInTime,
        checkOutTime,
        isLostTicket: dto.isLostTicket || false,
      });
      calculatedFee = calculation.fee;
    }

    // Update stay
    stay.checkOutTime = checkOutTime;
    stay.status = StayStatus.COMPLETED;
    stay.calculatedFee = calculatedFee;
    stay.isLostTicket = dto.isLostTicket || false;

    // Free up slot
    const slot = await this.slotRepository.findOne({ where: { id: stay.slot.id } });
    if (slot) {
      slot.isOccupied = false;
      await this.slotRepository.save(slot);
    }

    return await this.stayRepository.save(stay);
  }

  async getActiveStays(): Promise<Stay[]> {
    return await this.stayRepository.find({
      where: { status: StayStatus.ACTIVE },
      relations: ['vehicle', 'slot'],
      order: { checkInTime: 'DESC' },
    });
  }

  async getStayById(id: string): Promise<Stay> {
    const stay = await this.stayRepository.findOne({
      where: { id },
      relations: ['vehicle', 'slot', 'operator', 'payment'],
    });

    if (!stay) {
      throw new NotFoundException('Stay not found');
    }

    return stay;
  }

  async getAllStays(skip: number = 0, take: number = 20): Promise<{ stays: Stay[]; total: number }> {
    const [stays, total] = await this.stayRepository.findAndCount({
      relations: ['vehicle', 'slot'],
      order: { checkInTime: 'DESC' },
      skip,
      take,
    });

    return { stays, total };
  }
}
