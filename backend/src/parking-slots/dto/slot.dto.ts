import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '../../vehicles/vehicle.entity';

export class CreateSlotDto {
  @ApiProperty({ example: 'A-01' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  type: VehicleType;
}

export class UpdateSlotDto {
  @ApiProperty({ example: 'A-01', required: false })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
