// applications/dto/update-application.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum ApplicationStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus, example: 'viewed' })
  @IsEnum(ApplicationStatus)
  status: string;
}