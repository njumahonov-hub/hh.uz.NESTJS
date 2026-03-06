
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 1, description: 'Ishning ID raqami' })
  @IsNotEmpty()
  @IsNumber()
  job_id: number;

  @ApiProperty({ 
    example: "Assalomu alaykum, ushbu vakansiya bo'yicha bog'lanmoqchi edim.", 
    required: false 
  })
  @IsOptional()
  @IsString()
  message?: string;
}