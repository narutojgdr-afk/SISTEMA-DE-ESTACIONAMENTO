import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Stay } from '../stays/stay.entity';
import { Payment } from '../payments/payment.entity';
import { ParkingSlot } from '../parking-slots/parking-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stay, Payment, ParkingSlot])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
