import { IsString, IsNumber, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../payment.entity';

export class CreatePaymentDto {
  @ApiProperty({ example: 'stay-uuid' })
  @IsString()
  @IsNotEmpty()
  stayId: string;

  @ApiProperty({ example: 15.0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
