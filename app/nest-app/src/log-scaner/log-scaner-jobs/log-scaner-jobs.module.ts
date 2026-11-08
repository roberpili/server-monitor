import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogScanerJob } from './entities/log-scaner-job.entity.js';
import { LogScanerJobsController } from './log-scaner-jobs.controller.js';
import { LogScanerJobsService } from './log-scaner-jobs.service.js';
import { LogSourcesModule } from '../../log-sources/log-sources.module.js';
import { RemoteServersModule } from '../../remote-servers/remote-servers.module.js';
import { Anomaly } from './entities/anomaly.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogScanerJob, Anomaly]),
    LogSourcesModule,
    RemoteServersModule,
    LogScanerJobsModule,
  ],
  controllers: [LogScanerJobsController],
  providers: [LogScanerJobsService],
  exports: [LogScanerJobsService],
})
export class LogScanerJobsModule {}
