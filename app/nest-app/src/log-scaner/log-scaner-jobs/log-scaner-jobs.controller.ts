import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LogScanerJobsService } from './log-scaner-jobs.service.js';
import { CreateLogScanerJobDto } from './dto/create-log-scaner-job.dto.js';
import { CurrentUser } from '@/auth/current-user.decorator.js';
import type { ICurrentUser } from '@/auth/current-user.interface.js';
import { UpdateLogScanerJobDto } from './dto/update-log-scaner-job.dto.js';

@Controller('log-scaner-jobs')
export class LogScanerJobsController {
  constructor(private readonly logScanerJobsService: LogScanerJobsService) {}

  @Post()
  create(
    @Body() createLogScanerJobDto: CreateLogScanerJobDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.logScanerJobsService.create(
      createLogScanerJobDto,
      currentUser.id,
    );
  }

  @Get()
  findAll(@CurrentUser() currentUser: ICurrentUser) {
    return this.logScanerJobsService.findAll(currentUser.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: ICurrentUser) {
    return this.logScanerJobsService.findOne(id, currentUser.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogScanerJobDto: UpdateLogScanerJobDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.logScanerJobsService.update(
      id,
      currentUser.id,
      updateLogScanerJobDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: ICurrentUser) {
    return this.logScanerJobsService.remove(id, currentUser.id);
  }
}
