import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Stay } from '../stays/stay.entity';
import { MonthlySubscriber } from '../monthly-subscribers/monthly-subscriber.entity';

export enum VehicleType {
  CAR = 'car',
  MOTO = 'moto',
  PCD = 'pcd',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plate: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type: VehicleType;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Stay, (stay) => stay.vehicle)
  stays: Stay[];

  @OneToMany(() => MonthlySubscriber, (subscriber) => subscriber.vehicle)
  subscriptions: MonthlySubscriber[];
}
