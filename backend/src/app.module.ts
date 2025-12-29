import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ParkingSlotsModule } from './parking-slots/parking-slots.module';
import { StaysModule } from './stays/stays.module';
import { PricingModule } from './pricing/pricing.module';
import { PaymentsModule } from './payments/payments.module';
import { MonthlySubscribersModule } from './monthly-subscribers/monthly-subscribers.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Vehicle } from './vehicles/vehicle.entity';
import { ParkingSlot } from './parking-slots/parking-slot.entity';
import { Stay } from './stays/stay.entity';
import { PricingTable } from './pricing/pricing-table.entity';
import { Payment } from './payments/payment.entity';
import { MonthlySubscriber } from './monthly-subscribers/monthly-subscriber.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'parking_system',
      entities: [User, Vehicle, ParkingSlot, Stay, PricingTable, Payment, MonthlySubscriber],
      synchronize: true, // Only for development, use migrations in production
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    VehiclesModule,
    ParkingSlotsModule,
    StaysModule,
    PricingModule,
    PaymentsModule,
    MonthlySubscribersModule,
    ReportsModule,
  ],
})
export class AppModule {}
