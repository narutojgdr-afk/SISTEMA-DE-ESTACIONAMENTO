import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MonthlySubscribersService } from './monthly-subscribers.service';
import { CreateSubscriberDto, UpdateSubscriberDto } from './dto/subscriber.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Monthly Subscribers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscribers')
export class MonthlySubscribersController {
  constructor(private subscribersService: MonthlySubscribersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all monthly subscribers with pagination' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of subscribers' })
  async getAllSubscribers(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.subscribersService.getAllSubscribers(parseInt(skip), parseInt(take));
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active monthly subscribers' })
  @ApiResponse({ status: 200, description: 'List of active subscribers' })
  async getActiveSubscribers() {
    return this.subscribersService.getActiveSubscribers();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create monthly subscriber (Admin only)' })
  @ApiResponse({ status: 201, description: 'Subscriber created' })
  async createSubscriber(@Body() dto: CreateSubscriberDto) {
    return this.subscribersService.createSubscriber(
      dto.vehicleId,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.monthlyFee,
    );
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update monthly subscriber (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscriber updated' })
  async updateSubscriber(@Param('id') id: string, @Body() dto: UpdateSubscriberDto) {
    const updateData: any = { ...dto };
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);
    return this.subscribersService.updateSubscriber(id, updateData);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete monthly subscriber (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscriber deleted' })
  async deleteSubscriber(@Param('id') id: string) {
    return this.subscribersService.deleteSubscriber(id);
  }
}
