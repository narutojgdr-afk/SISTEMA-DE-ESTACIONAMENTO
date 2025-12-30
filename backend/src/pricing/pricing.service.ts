import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingTable } from './pricing-table.entity';

export interface PricingCalculationParams {
  checkInTime: Date;
  checkOutTime: Date;
  isLostTicket?: boolean;
}

export interface PricingCalculationResult {
  durationMinutes: number;
  chargeableMinutes: number;
  fee: number;
  appliedTolerance: boolean;
  appliedDailyCap: boolean;
  isLostTicket: boolean;
}

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(PricingTable)
    private pricingTableRepository: Repository<PricingTable>,
  ) {}

  async getActivePricingTable(): Promise<PricingTable> {
    const pricing = await this.pricingTableRepository.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (!pricing) {
      throw new Error('No active pricing table found');
    }

    return pricing;
  }

  async calculateFee(params: PricingCalculationParams): Promise<PricingCalculationResult> {
    const pricing = await this.getActivePricingTable();
    return this.calculateFeeWithPricing(params, pricing);
  }

  calculateFeeWithPricing(
    params: PricingCalculationParams,
    pricing: PricingTable,
  ): PricingCalculationResult {
    const { checkInTime, checkOutTime, isLostTicket = false } = params;

    if (isLostTicket) {
      return {
        durationMinutes: 0,
        chargeableMinutes: 0,
        fee: Number(pricing.lostTicketFee),
        appliedTolerance: false,
        appliedDailyCap: false,
        isLostTicket: true,
      };
    }

    // Calculate duration in minutes
    const durationMs = checkOutTime.getTime() - checkInTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    // Apply free tolerance
    if (durationMinutes <= pricing.freeToleranceMinutes) {
      return {
        durationMinutes,
        chargeableMinutes: 0,
        fee: 0,
        appliedTolerance: true,
        appliedDailyCap: false,
        isLostTicket: false,
      };
    }

    // Calculate chargeable minutes (subtract tolerance)
    const chargeableMinutes = durationMinutes - pricing.freeToleranceMinutes;

    // Calculate number of prorated fractions (e.g., hours)
    const fractions = Math.ceil(chargeableMinutes / pricing.proratedFractionMinutes);

    // Calculate fee based on fractions
    const hourlyRate = Number(pricing.hourlyRate);
    const calculatedFee = fractions * hourlyRate;

    // Apply daily cap
    const dailyCap = Number(pricing.dailyCap);
    const fee = Math.min(calculatedFee, dailyCap);
    const appliedDailyCap = calculatedFee > dailyCap;

    return {
      durationMinutes,
      chargeableMinutes,
      fee,
      appliedTolerance: false,
      appliedDailyCap,
      isLostTicket: false,
    };
  }

  async createPricingTable(data: Partial<PricingTable>): Promise<PricingTable> {
    const pricing = this.pricingTableRepository.create(data);
    return await this.pricingTableRepository.save(pricing);
  }

  async updatePricingTable(id: string, data: Partial<PricingTable>): Promise<PricingTable> {
    await this.pricingTableRepository.update(id, data);
    return await this.pricingTableRepository.findOne({ where: { id } });
  }

  async getAllPricingTables(): Promise<PricingTable[]> {
    return await this.pricingTableRepository.find({ order: { createdAt: 'DESC' } });
  }
}
