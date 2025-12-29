import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue report (Admin only)' })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: true, type: String, example: '2024-01-31' })
  @ApiResponse({ status: 200, description: 'Revenue report' })
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getRevenueReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily report (Admin only)' })
  @ApiQuery({ name: 'date', required: true, type: String, example: '2024-01-01' })
  @ApiResponse({ status: 200, description: 'Daily report' })
  async getDailyReport(@Query('date') date: string) {
    return this.reportsService.getDailyReport(new Date(date));
  }

  @Get('occupancy-history')
  @ApiOperation({ summary: 'Get occupancy history (Admin only)' })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: true, type: String, example: '2024-01-31' })
  @ApiResponse({ status: 200, description: 'Occupancy history' })
  async getOccupancyHistory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getOccupancyHistory(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
