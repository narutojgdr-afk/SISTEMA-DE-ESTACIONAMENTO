import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaysService } from './stays.service';
import { StaysController } from './stays.controller';
import { Stay } from './stay.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { ParkingSlot } from '../parking-slots/parking-slot.entity';
import { PricingModule } from '../pricing/pricing.module';
import { MonthlySubscribersModule } from '../monthly-subscribers/monthly-subscribers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stay, Vehicle, ParkingSlot]),
    PricingModule,
    forwardRef(() => MonthlySubscribersModule),
  ],
  providers: [StaysService],
  controllers: [StaysController],
  exports: [StaysService],
})
export class StaysModule {}
