import { PartialType } from '@nestjs/mapped-types';
import { CreateSavedJobDto } from './create-saved.dto';

export class UpdateSavedDto extends PartialType(CreateSavedJobDto) {}
