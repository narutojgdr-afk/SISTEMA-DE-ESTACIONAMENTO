import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';

@ApiTags('Pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pricing')
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all pricing tables' })
  @ApiResponse({ status: 200, description: 'List of pricing tables' })
  async getAllPricingTables() {
    return this.pricingService.getAllPricingTables();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active pricing table' })
  @ApiResponse({ status: 200, description: 'Active pricing table' })
  async getActivePricingTable() {
    return this.pricingService.getActivePricingTable();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create pricing table (Admin only)' })
  @ApiResponse({ status: 201, description: 'Pricing table created' })
  async createPricingTable(@Body() dto: CreatePricingDto) {
    return this.pricingService.createPricingTable(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update pricing table (Admin only)' })
  @ApiResponse({ status: 200, description: 'Pricing table updated' })
  async updatePricingTable(@Param('id') id: string, @Body() dto: UpdatePricingDto) {
    return this.pricingService.updatePricingTable(id, dto);
  }
}
