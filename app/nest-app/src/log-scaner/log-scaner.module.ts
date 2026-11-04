import { Module } from '@nestjs/common';
import { LogScanerJobsModule } from './log-scaner-jobs/log-scaner-jobs.module.js';

@Module({
  imports: [LogScanerJobsModule],
  exports: [LogScanerJobsModule],
})
export class LogScanerModule {}
