import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogScanerJob } from './entities/log-scaner-job.entity.js';
import { LogScanerJobsController } from './log-scaner-jobs.controller.js';
import { LogScanerJobsService } from './log-scaner-jobs.service.js';
import { LogSourcesModule } from '../../log-sources/log-sources.module.js';
import { RemoteServersModule } from '../../remote-servers/remote-servers.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogScanerJob]),
    LogSourcesModule,
    RemoteServersModule,
    LogScanerJobsModule,
  ],
  controllers: [LogScanerJobsController],
  providers: [LogScanerJobsService],
})
export class LogScanerJobsModule {}
