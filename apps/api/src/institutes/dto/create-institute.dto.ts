import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, IsUUID } from 'class-validator';
import { Tier } from '@repo/database';

export class CreateInstituteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, { message: 'Subdomain can only contain lowercase letters, numbers, and hyphens' })
  subdomain?: string;

  @IsEnum(Tier)
  @IsNotEmpty()
  tier: Tier;

  @IsUUID()
  @IsOptional()
  ownerId?: string;
}
