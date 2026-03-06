
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDto {
  @ApiProperty({ required: false, default: "nodirbek67"})
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false, default: "nodirbek" })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ required: false, default: "jumahonov" })
  @IsOptional()
  @IsString()
  last_name?: string;

  
  @ApiProperty({ required: false, default: "904236768" })
  @IsOptional()
  @IsString()
  phone_number?: string;
}