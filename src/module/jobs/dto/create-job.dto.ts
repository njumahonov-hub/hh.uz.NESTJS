import { 
  IsNotEmpty, 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsObject, 
  IsNumber 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkDay } from 'src/shared/constant/workday';
import { WorkTime } from 'src/shared/constant/worktime';
import { WorkFormat } from 'src/shared/constant/workformat';
import { WorkExperience } from 'src/shared/constant/work.experience';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior NodeJS Developer' })
  @IsString()
  @IsNotEmpty()
  job_title: string;

  @ApiProperty({ example: 'Apple Inc.' })
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @ApiProperty({ example: '2500$' })
  @IsString()
  @IsNotEmpty()
  job_price: string;

  @ApiProperty({ example: 'Bizga tajribali backendchi kerak...' })
  @IsString()
  @IsNotEmpty()
  job_description: string;

  @ApiProperty({ enum: WorkDay, default: WorkDay.FIVE_TWO })
  @IsEnum(WorkDay)
  @IsOptional()
  work_day: WorkDay;

  @ApiProperty({ enum: WorkTime, default: WorkTime.EIGHT_HOUR_A_DAY })
  @IsEnum(WorkTime)
  @IsOptional()
  work_time: WorkTime;

  @ApiProperty({ enum: WorkFormat, default: WorkFormat.GIBRID })
  @IsEnum(WorkFormat)
  @IsOptional()
  work_format: WorkFormat;

  @ApiProperty({ enum: WorkExperience, default: WorkExperience.NO_EXPERIENCE })
  @IsEnum(WorkExperience)
  @IsOptional()
  work_experience: WorkExperience;

  @ApiProperty({ example: 1, description: 'Kategoriya ID raqami' })
  @IsNumber()
  @IsNotEmpty()
  cate_id: number;

  @ApiProperty({ example: 1, description: 'Joylashuv (Location) ID raqami' })
  @IsNumber()
  @IsNotEmpty()
  location_id: number;

  @ApiProperty({ 
    example: { 
      telegram: "@hr_manager", 
      benefits: ["Free lunch", "Insurance"],
      contact_email: "jobs@apple.com" 
    },
    required: false,
    description: "Qo'shimcha ixtiyoriy ma'lumotlar"
  })
  @IsOptional()
  @IsObject()
  extra_details?: Record<string, any>;
}