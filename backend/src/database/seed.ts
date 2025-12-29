import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { PricingTable } from '../pricing/pricing-table.entity';
import { ParkingSlot } from '../parking-slots/parking-slot.entity';
import { VehicleType } from '../vehicles/vehicle.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('Seeding database...');

  const userRepository = dataSource.getRepository(User);
  const pricingRepository = dataSource.getRepository(PricingTable);
  const slotRepository = dataSource.getRepository(ParkingSlot);

  // Seed admin user
  const adminExists = await userRepository.findOne({ where: { username: 'admin' } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = userRepository.create({
      username: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    await userRepository.save(admin);
    console.log('Admin user created: username=admin, password=admin123');
  }

  // Seed operator user
  const operatorExists = await userRepository.findOne({ where: { username: 'operator' } });
  if (!operatorExists) {
    const hashedPassword = await bcrypt.hash('operator123', 10);
    const operator = userRepository.create({
      username: 'operator',
      password: hashedPassword,
      role: UserRole.OPERATOR,
    });
    await userRepository.save(operator);
    console.log('Operator user created: username=operator, password=operator123');
  }

  // Seed pricing table
  const pricingExists = await pricingRepository.findOne({ where: { isActive: true } });
  if (!pricingExists) {
    const pricing = pricingRepository.create({
      freeToleranceMinutes: parseInt(process.env.PRICING_FREE_TOLERANCE_MINUTES) || 15,
      proratedFractionMinutes: parseInt(process.env.PRICING_PRORATED_FRACTION_MINUTES) || 60,
      hourlyRate: parseFloat(process.env.PRICING_HOURLY_RATE) || 5.0,
      dailyCap: parseFloat(process.env.PRICING_DAILY_CAP) || 50.0,
      lostTicketFee: parseFloat(process.env.PRICING_LOST_TICKET_FEE) || 100.0,
      isActive: true,
    });
    await pricingRepository.save(pricing);
    console.log('Default pricing table created');
  }

  // Seed parking slots
  const slotsExist = await slotRepository.count();
  if (slotsExist === 0) {
    const slots = [];
    
    // Car slots
    for (let i = 1; i <= 20; i++) {
      slots.push(
        slotRepository.create({
          number: `C-${String(i).padStart(2, '0')}`,
          type: VehicleType.CAR,
        }),
      );
    }

    // Moto slots
    for (let i = 1; i <= 10; i++) {
      slots.push(
        slotRepository.create({
          number: `M-${String(i).padStart(2, '0')}`,
          type: VehicleType.MOTO,
        }),
      );
    }

    // PCD slots
    for (let i = 1; i <= 5; i++) {
      slots.push(
        slotRepository.create({
          number: `P-${String(i).padStart(2, '0')}`,
          type: VehicleType.PCD,
        }),
      );
    }

    await slotRepository.save(slots);
    console.log('Parking slots created: 20 car, 10 moto, 5 PCD');
  }

  console.log('Database seeding completed!');
}
