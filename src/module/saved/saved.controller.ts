import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SavedService } from './saved.service';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateSavedJobDto } from './dto/create-saved.dto';

@ApiTags('Saved Jobs (Saqlanganlar)')
@ApiInternalServerErrorResponse({description: "internal server error"})
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Post('toggle')
  @ApiOperation({ summary: "Ishni saqlash yoki o'chirish (Toggle)" })
  async toggle(@Req() req: any, @Body() dto: CreateSavedJobDto) {
    const userId = req.user.id;
    return this.savedService.toggleSavedJob(userId, dto.job_id);
  }

  @Get()
  @ApiOperation({ summary: "Mening barcha saqlangan ishlarim" })
  async getMySaved(@Req() req: any) {
    const userId = req.user.id;
    return this.savedService.getMySavedJobs(userId);
  }

  // @Post()
  // create(@Body() createSavedDto: CreateSavedDto) {
  //   return this.savedService.create(createSavedDto);
  // }

  // @Get()
  // findAll() {
  //   return this.savedService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.savedService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSavedDto: UpdateSavedDto) {
  //   return this.savedService.update(+id, updateSavedDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.savedService.remove(+id);
  // }
}
