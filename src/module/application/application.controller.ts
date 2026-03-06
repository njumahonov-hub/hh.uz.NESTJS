import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import {  UpdateApplicationStatusDto } from './dto/update-application.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';

@ApiTags('Applications')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: "Ishga murojaat qilish (Bog'lanish)" })
  async create(@Req() req: any, @Body() dto: CreateApplicationDto) {
    const userId = req.user.id; 
    return this.applicationService.create(userId, dto);
  }

  @ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Get('incoming') 
@ApiOperation({ summary: "Ish beruvchiga kelgan barcha murojaatlar (Arizalar)" })
async getIncoming(@Req() req: any) {
  const employerId = req.user.id;
  return this.applicationService.getEmployerApplications(employerId);
}


  @ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Get('my-applications') 
@ApiOperation({ summary: "Nomzod o'zi yuborgan barcha murojaatlarni ko'rishi" })
async getMyApps(@Req() req: any) {
  const userId = req.user.id;
  return this.applicationService.getMyApplications(userId);
}


  @ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Patch(':id/status')
@ApiOperation({ 
  summary: "Ariza statusini o'zgartirish (Faqat ish beruvchi uchun)",
  description: "Ish beruvchi nomzodning arizasini 'ko'rildi', 'qabul qilindi' yoki 'rad etildi' holatiga o'tkazadi."
})
@ApiResponse({ status: 200, description: "Status muvaffaqiyatli yangilandi." })
async updateStatus(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: any,
  @Body() dto: UpdateApplicationStatusDto
  ,
) {
  const employerId = req.user.id;
  return this.applicationService.updateStatus(id, employerId, dto.status);
}

  // @Get()
  // findAll() {
  //   return this.applicationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.applicationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
  //   return this.applicationService.update(+id, updateApplicationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.applicationService.remove(+id);
  // }
}
