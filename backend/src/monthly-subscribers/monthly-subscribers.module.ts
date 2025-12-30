import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlySubscribersService } from './monthly-subscribers.service';
import { MonthlySubscribersController } from './monthly-subscribers.controller';
import { MonthlySubscriber } from './monthly-subscriber.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlySubscriber, Vehicle])],
  providers: [MonthlySubscribersService],
  controllers: [MonthlySubscribersController],
  exports: [MonthlySubscribersService],
})
export class MonthlySubscribersModule {}
