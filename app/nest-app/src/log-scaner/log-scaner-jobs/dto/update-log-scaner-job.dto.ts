import { IsOptional, IsString } from 'class-validator';

export class UpdateLogScanerJobDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
