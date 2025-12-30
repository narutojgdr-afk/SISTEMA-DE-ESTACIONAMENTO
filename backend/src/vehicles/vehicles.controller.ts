import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vehicles with pagination' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of vehicles' })
  async getAllVehicles(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.vehiclesService.getAllVehicles(parseInt(skip), parseInt(take));
  }

  @Get('search')
  @ApiOperation({ summary: 'Search vehicles' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchVehicles(@Query('q') query: string) {
    return this.vehiclesService.searchVehicles(query);
  }

  @Get(':plate')
  @ApiOperation({ summary: 'Get vehicle by plate' })
  @ApiResponse({ status: 200, description: 'Vehicle details' })
  async getVehicleByPlate(@Param('plate') plate: string) {
    return this.vehiclesService.getVehicleByPlate(plate);
  }
}
