import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { LogScanerType } from '../entities/log-scaner-job.entity.js';

export class CreateLogScanerJobDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(LogScanerType)
  type: LogScanerType;

  @IsString()
  @IsOptional()
  logSourceId?: string;

  @IsString()
  remoteServerId: string;

  @IsObject()
  @IsOptional()
  ticketSystemConfig?: Record<string, any>;
}
