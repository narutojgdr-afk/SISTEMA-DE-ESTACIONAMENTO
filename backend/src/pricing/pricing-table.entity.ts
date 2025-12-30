import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pricing_tables')
export class PricingTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 15 })
  freeToleranceMinutes: number;

  @Column({ default: 60 })
  proratedFractionMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyCap: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lostTicketFee: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
