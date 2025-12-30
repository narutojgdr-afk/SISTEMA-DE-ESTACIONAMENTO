import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { ParkingSlot } from '../parking-slots/parking-slot.entity';
import { User } from '../users/user.entity';
import { Payment } from '../payments/payment.entity';

export enum StayStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity('stays')
export class Stay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.stays)
  vehicle: Vehicle;

  @ManyToOne(() => ParkingSlot, (slot) => slot.stays)
  slot: ParkingSlot;

  @Column()
  checkInTime: Date;

  @Column({ nullable: true })
  checkOutTime: Date;

  @Column({
    type: 'enum',
    enum: StayStatus,
    default: StayStatus.ACTIVE,
  })
  status: StayStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  calculatedFee: number;

  @Column({ default: false })
  isLostTicket: boolean;

  @ManyToOne(() => User, (user) => user.stays)
  operator: User;

  @OneToOne(() => Payment, (payment) => payment.stay, { nullable: true })
  payment: Payment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
