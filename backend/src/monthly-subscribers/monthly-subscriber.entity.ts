import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';

@Entity('monthly_subscribers')
export class MonthlySubscriber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.subscriptions)
  vehicle: Vehicle;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyFee: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
