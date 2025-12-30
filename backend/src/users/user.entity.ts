import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Stay } from '../stays/stay.entity';
import { Payment } from '../payments/payment.entity';

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OPERATOR,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Stay, (stay) => stay.operator)
  stays: Stay[];

  @OneToMany(() => Payment, (payment) => payment.operator)
  payments: Payment[];
}
