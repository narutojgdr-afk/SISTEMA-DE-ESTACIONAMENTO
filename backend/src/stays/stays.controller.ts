import { Controller, Post, Get, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StaysService } from './stays.service';
import { CheckInDto, CheckOutDto } from './dto/stay.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Stays')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stays')
export class StaysController {
  constructor(private staysService: StaysService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check-in a vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle checked in successfully' })
  async checkIn(@Body() dto: CheckInDto, @Request() req) {
    return this.staysService.checkIn(dto, req.user.userId);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Check-out a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle checked out successfully' })
  async checkOut(@Body() dto: CheckOutDto, @Request() req) {
    return this.staysService.checkOut(dto, req.user.userId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active stays' })
  @ApiResponse({ status: 200, description: 'List of active stays' })
  async getActiveStays() {
    return this.staysService.getActiveStays();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stay by ID' })
  @ApiResponse({ status: 200, description: 'Stay details' })
  async getStayById(@Param('id') id: string) {
    return this.staysService.getStayById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stays with pagination' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of stays' })
  async getAllStays(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
  ) {
    return this.staysService.getAllStays(parseInt(skip), parseInt(take));
  }
}
