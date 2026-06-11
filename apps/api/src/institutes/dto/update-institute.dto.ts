import { PartialType } from '@nestjs/mapped-types';
import { CreateInstituteDto } from './create-institute.dto';

// NestJS mapped-types automatically makes all fields from CreateInstituteDto optional
export class UpdateInstituteDto extends PartialType(CreateInstituteDto) {}
