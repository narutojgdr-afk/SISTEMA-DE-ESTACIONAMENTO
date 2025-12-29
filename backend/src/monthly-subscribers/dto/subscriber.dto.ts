import { IsString, IsNumber, IsNotEmpty, IsDateString, Min, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriberDto {
  @ApiProperty({ example: 'vehicle-uuid' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 200.0 })
  @IsNumber()
  @Min(0)
  monthlyFee: number;
}

export class UpdateSubscriberDto {
  @ApiProperty({ example: '2024-01-01', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 200.0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  monthlyFee?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
