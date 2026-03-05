import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Information Technology' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  cate_title: string;
}