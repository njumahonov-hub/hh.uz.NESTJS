// dto/update-category.dto.ts
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Mobile Development', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  cate_title?: string;
}