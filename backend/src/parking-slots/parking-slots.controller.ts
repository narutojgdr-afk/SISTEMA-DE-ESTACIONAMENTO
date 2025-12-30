import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ParkingSlotsService } from './parking-slots.service';
import { CreateSlotDto, UpdateSlotDto } from './dto/slot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Parking Slots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('slots')
export class ParkingSlotsController {
  constructor(private slotsService: ParkingSlotsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all parking slots' })
  @ApiResponse({ status: 200, description: 'List of parking slots' })
  async getAllSlots() {
    return this.slotsService.getAllSlots();
  }

  @Get('occupancy')
  @ApiOperation({ summary: 'Get parking occupancy statistics' })
  @ApiResponse({ status: 200, description: 'Occupancy data' })
  async getOccupancy() {
    return this.slotsService.getOccupancy();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create parking slot (Admin only)' })
  @ApiResponse({ status: 201, description: 'Slot created' })
  async createSlot(@Body() dto: CreateSlotDto) {
    return this.slotsService.createSlot(dto.number, dto.type);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update parking slot (Admin only)' })
  @ApiResponse({ status: 200, description: 'Slot updated' })
  async updateSlot(@Param('id') id: string, @Body() dto: UpdateSlotDto) {
    return this.slotsService.updateSlot(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete parking slot (Admin only)' })
  @ApiResponse({ status: 200, description: 'Slot deleted' })
  async deleteSlot(@Param('id') id: string) {
    return this.slotsService.deleteSlot(id);
  }
}
