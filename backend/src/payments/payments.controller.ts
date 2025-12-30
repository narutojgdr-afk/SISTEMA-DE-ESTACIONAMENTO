import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment' })
  @ApiResponse({ status: 201, description: 'Payment created' })
  async createPayment(@Body() dto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.createPayment(
      dto.stayId,
      dto.amount,
      dto.method,
      req.user.userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments with pagination' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of payments' })
  async getAllPayments(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.paymentsService.getAllPayments(parseInt(skip), parseInt(take));
  }
}
