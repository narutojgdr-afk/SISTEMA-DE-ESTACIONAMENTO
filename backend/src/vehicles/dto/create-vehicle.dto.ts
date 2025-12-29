import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '../vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ example: 'Toyota Corolla', required: false })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 'Black', required: false })
  @IsString()
  @IsOptional()
  color?: string;
}
