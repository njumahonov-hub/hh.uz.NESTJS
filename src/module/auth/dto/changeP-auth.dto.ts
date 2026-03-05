import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ default: "" })
  @IsString()
  oldPassword: string;

  @ApiProperty({ default: "" })
  @IsString()
  @MinLength(6, { message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  newPassword: string;
}