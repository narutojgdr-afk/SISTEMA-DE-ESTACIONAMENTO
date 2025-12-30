import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PricingTable } from './pricing-table.entity';

describe('PricingService', () => {
  let service: PricingService;
  let mockPricingTable: PricingTable;

  beforeEach(async () => {
    mockPricingTable = {
      id: '1',
      freeToleranceMinutes: 15,
      proratedFractionMinutes: 60,
      hourlyRate: 5.0,
      dailyCap: 50.0,
      lostTicketFee: 100.0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: 'PricingTableRepository',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateFeeWithPricing', () => {
    it('should return zero fee for stays within tolerance (15 minutes)', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T10:10:00'); // 10 minutes

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime },
        mockPricingTable,
      );

      expect(result.fee).toBe(0);
      expect(result.appliedTolerance).toBe(true);
      expect(result.durationMinutes).toBe(10);
    });

    it('should return zero fee for stays exactly at tolerance (15 minutes)', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T10:15:00'); // 15 minutes

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime },
        mockPricingTable,
      );

      expect(result.fee).toBe(0);
      expect(result.appliedTolerance).toBe(true);
      expect(result.durationMinutes).toBe(15);
    });

    it('should charge one hour for stays just over tolerance (16 minutes)', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T10:16:00'); // 16 minutes

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime },
        mockPricingTable,
      );

      expect(result.fee).toBe(5.0); // 1 hour * $5
      expect(result.appliedTolerance).toBe(false);
      expect(result.chargeableMinutes).toBe(1); // 16 - 15 tolerance
    });

    it('should charge prorated per hour (75 minutes = 2 hours)', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T11:15:00'); // 75 minutes

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime },
        mockPricingTable,
      );

      // 75 - 15 tolerance = 60 chargeable minutes = 1 hour
      expect(result.fee).toBe(5.0); // 1 hour * $5
      expect(result.chargeableMinutes).toBe(60);
    });

    it('should charge prorated per hour (76 minutes = 2 hours after tolerance)', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T11:16:00'); // 76 minutes

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime },
        mockPricingTable,
      );

      // 76 - 15 tolerance = 61 chargeable minutes = ceil(61/60) = 2 hours
      expect(result.fee).toBe(10.0); // 2 hours * $5
      expect(result.chargeableMinutes).toBe(61);
    });

    it('should apply daily cap when calculated fee exceeds cap', () => {
      const checkInTime = new Date('2024-01-01T08:00:00');
      const checkOutTime = new Date('2024-01-01T20:00:00'); // 12 hours = 720 minutes

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime },
        mockPricingTable,
      );

      // 720 - 15 tolerance = 705 chargeable minutes = ceil(705/60) = 12 hours
      // 12 hours * $5 = $60, but daily cap is $50
      expect(result.fee).toBe(50.0);
      expect(result.appliedDailyCap).toBe(true);
    });

    it('should not apply daily cap when fee is below cap', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T12:00:00'); // 120 minutes

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime },
        mockPricingTable,
      );

      // 120 - 15 tolerance = 105 chargeable minutes = ceil(105/60) = 2 hours
      // 2 hours * $5 = $10, below cap
      expect(result.fee).toBe(10.0);
      expect(result.appliedDailyCap).toBe(false);
    });

    it('should charge lost ticket fee when ticket is lost', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T12:00:00');

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime, isLostTicket: true },
        mockPricingTable,
      );

      expect(result.fee).toBe(100.0);
      expect(result.isLostTicket).toBe(true);
      expect(result.appliedTolerance).toBe(false);
      expect(result.appliedDailyCap).toBe(false);
    });

    it('should handle multi-day stays with daily cap', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-03T10:00:00'); // 2 days = 2880 minutes

      const result = service.calculateFeeWithPricing(
        { checkInTime, checkOutTime },
        mockPricingTable,
      );

      // 2880 - 15 tolerance = 2865 chargeable minutes = ceil(2865/60) = 48 hours
      // 48 hours * $5 = $240, but daily cap is $50
      expect(result.fee).toBe(50.0);
      expect(result.appliedDailyCap).toBe(true);
    });
  });
});
