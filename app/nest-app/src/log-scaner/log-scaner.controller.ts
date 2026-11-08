import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { LogScanerService } from './log-scaner.service.js';
import { CurrentUser } from '@/auth/current-user.decorator.js';
import type { ICurrentUser } from '@/auth/current-user.interface.js';

@Controller('log-scaner')
export class LogScanerController {
  constructor(private readonly logScanerService: LogScanerService) {}

  @ApiBody({ type: Array<Record<string, any>> })
  @Post('ingest/:jobId')
  async ingestLog(
    @Param('jobId') jobId: string,
    @Body() body: Array<Record<string, any>>,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    await this.logScanerService.ingestLogs(jobId, currentUser.id, body);
  }
}
