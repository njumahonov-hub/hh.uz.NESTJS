
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSavedJobDto {
  @ApiProperty({ example: 1, description: 'Saqlanadigan ishning ID raqami' })
  @IsNotEmpty()
  @IsNumber()
  job_id: number;
}
