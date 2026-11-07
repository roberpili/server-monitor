import { Module } from '@nestjs/common';
import { LogScanerJobsModule } from './log-scaner-jobs/log-scaner-jobs.module.js';
import { LogScanerController } from './log-scaner.controller.js';

@Module({
  imports: [LogScanerJobsModule],
  exports: [LogScanerJobsModule],
  controllers: [LogScanerController],
})
export class LogScanerModule {}
