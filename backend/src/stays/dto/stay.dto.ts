import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '../../vehicles/vehicle.entity';

export class CheckInDto {
  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty({ example: 'Toyota Corolla', required: false })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 'Black', required: false })
  @IsString()
  @IsOptional()
  color?: string;
}

export class CheckOutDto {
  @ApiProperty({ example: 'stay-uuid' })
  @IsString()
  @IsNotEmpty()
  stayId: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isLostTicket?: boolean;
}
