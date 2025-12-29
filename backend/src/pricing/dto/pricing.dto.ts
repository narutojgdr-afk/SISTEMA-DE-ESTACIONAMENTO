import { IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePricingDto {
  @ApiProperty({ example: 15, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  freeToleranceMinutes?: number;

  @ApiProperty({ example: 60, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  proratedFractionMinutes?: number;

  @ApiProperty({ example: 5.0 })
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @Min(0)
  dailyCap: number;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  @Min(0)
  lostTicketFee: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePricingDto {
  @ApiProperty({ example: 15, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  freeToleranceMinutes?: number;

  @ApiProperty({ example: 60, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  proratedFractionMinutes?: number;

  @ApiProperty({ example: 5.0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({ example: 50.0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  dailyCap?: number;

  @ApiProperty({ example: 100.0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  lostTicketFee?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
