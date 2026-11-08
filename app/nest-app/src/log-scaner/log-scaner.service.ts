import { Injectable, NotFoundException } from '@nestjs/common';
import { LogScanerJobsService } from './log-scaner-jobs/log-scaner-jobs.service.js';
import { AnomalySeverity } from './log-scaner-jobs/entities/anomaly.entity.js';

@Injectable()
export class LogScanerService {
  constructor(private logScanerJobsService: LogScanerJobsService) {}

  async ingestLogs(
    jobId: string,
    ownerId: string,
    logs: Array<Record<string, any>>,
  ) {
    const job = await this.logScanerJobsService.findOne(jobId, ownerId);
    if (!job) {
      throw new NotFoundException('job not found');
    }

    for (const log of logs) {
      const message = log['message'] || 'untitled';
      const level = log['level'] || 'error';
      this.logScanerJobsService.addAnomaly(job, {
        title: message,
        severity:
          level === 'critical'
            ? AnomalySeverity.CRITICAL
            : AnomalySeverity.HIGH,
      });
    }
  }
}
