import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty({ example: 'Germany', required: false })
  @IsString()
  @IsOptional()
  country_name?: string;
}