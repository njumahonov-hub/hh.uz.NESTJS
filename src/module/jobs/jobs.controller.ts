import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { WorkDay } from 'src/shared/constant/workday';
import { WorkTime } from 'src/shared/constant/worktime';
import { WorkFormat } from 'src/shared/constant/workformat';
import { WorkExperience } from 'src/shared/constant/work.experience';
import { GetJobsFilterDto } from './dto/GetJobsFilterDto';
import { OwnerGuard } from './guard/owner.guard';

@ApiTags("Jobs")
@ApiInternalServerErrorResponse({description: "internal server error"})
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}


@Get('constants/work-metadata')
@ApiOperation({ summary: "Ish e'loni uchun barcha doimiy qiymatlarni (Enum) olish" })
getWorkMetadata() {
  return {
    work_day: Object.values(WorkDay),
    work_time: Object.values(WorkTime),
    work_format: Object.values(WorkFormat),
    work_experience: Object.values(WorkExperience),
  };
}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard) 
  @Post()
  @ApiOperation({ summary: "Yangi ish e'lonini qo'shish" })
  async create(@Req() req: any, @Body() createJobDto: CreateJobDto) {
    const userId = req.user.id; 
    return this.jobsService.createJob(userId, createJobDto);
  }

  
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard) 
@Get()
@ApiOperation({ summary: "Barcha ishlarni qidirish va filtrlash (Public)" })
async findAll(@Query() filterDto: GetJobsFilterDto) {
  return this.jobsService.findAll(filterDto);
}


  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard) 
 @Get(':id')
  @ApiOperation({ 
    summary: "Bitta ish e'lonini batafsil ko'rish",
    description: "ID orqali ishni oladi. Bunda muallifning faqat ismi, familiyasi va telefoni qaytadi." 
  })
  @ApiParam({ name: 'id', description: 'Ish e’lonining ID raqami', example: 1 })
  @ApiResponse({ status: 200, description: "Ish e'loni muvaffaqiyatli topildi." })
  @ApiResponse({ status: 404, description: "Bunday ID li ish topilmadi." })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, OwnerGuard) 
@Patch(':id')
  @ApiOperation({ 
    summary: " ish e'lonini o'zgartirish",
    description: "ish e'lonini o'zgartirish (owner)" 
  })
  @ApiParam({ name: 'id', description: 'Ish e’lonining ID raqami', example: 1 })
  @ApiResponse({ status: 404, description: "Bunday ID li ish topilmadi." })
async update(
  @Param('id') id: number,
  @Body() updateJobDto: UpdateJobDto,
) {
  return this.jobsService.update(id, updateJobDto);
}

@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, OwnerGuard)
  @Delete(':id')
  @ApiOperation({ 
    summary: " ish e'lonini o'chirish",
    description: "ish e'lonini o'chirish (owner)" 
  })
  @ApiParam({ name: 'id', description: 'Ish e’lonining ID raqami', example: 1 })
  @ApiResponse({ status: 404, description: "Bunday ID li ish topilmadi." })
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
