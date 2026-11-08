import { Module } from '@nestjs/common';
import { LogScanerJobsModule } from './log-scaner-jobs/log-scaner-jobs.module.js';
import { LogScanerController } from './log-scaner.controller.js';
import { LogScanerService } from './log-scaner.service.js';

@Module({
  imports: [LogScanerJobsModule],
  exports: [LogScanerJobsModule],
  controllers: [LogScanerController],
  providers: [LogScanerService],
})
export class LogScanerModule {}
