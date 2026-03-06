
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';

@ApiTags('Statistics (Statistika)')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('global')
  @ApiOperation({ summary: "Umumiy tizim statistikasi (Bosh sahifa uchun)" })
  async getPublicStats() {
    return this.statsService.getGlobalStats();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Get('dashboard')
  @ApiOperation({ summary: "Ish beruvchi uchun shaxsiy dashboard" })
  async getDashboard(@Req() req: any) {
    return this.statsService.getEmployerDashboard(req.user.id);
  }
}