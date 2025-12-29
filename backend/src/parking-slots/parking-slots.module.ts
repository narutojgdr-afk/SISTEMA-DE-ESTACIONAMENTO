import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotsService } from './parking-slots.service';
import { ParkingSlotsController } from './parking-slots.controller';
import { ParkingSlot } from './parking-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSlot])],
  providers: [ParkingSlotsService],
  controllers: [ParkingSlotsController],
  exports: [ParkingSlotsService],
})
export class ParkingSlotsModule {}
