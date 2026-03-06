import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetJobsFilterDto {
  @IsOptional() @IsString()
  @ApiProperty({ required: false })
    search?: string; 

  @IsOptional() @Type(() => Number) @IsNumber()
  @ApiProperty({ required: false })
  cate_id?: number;

  @IsOptional() @Type(() => Number) @IsNumber()
  @ApiProperty({ required: false })
  location_id?: number;

@IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1; 

  @IsOptional()
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}