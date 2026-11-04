import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LogScanerJob,
  LogScanerStatus,
} from './entities/log-scaner-job.entity.js';
import { Repository } from 'typeorm';
import { CreateLogScanerJobDto } from './dto/create-log-scaner-job.dto.js';
import { UpdateLogScanerJobDto } from './dto/update-log-scaner-job.dto.js';
import { RemoteServersService } from '@/remote-servers/remote-servers.service.js';
import { LogSourcesService } from '@/log-sources/log-sources.service.js';

@Injectable()
export class LogScanerJobsService {
  constructor(
    @InjectRepository(LogScanerJob)
    private repo: Repository<LogScanerJob>,
    private logSourceService: LogSourcesService,
    private remoteServerService: RemoteServersService,
  ) {}

  async create(props: CreateLogScanerJobDto, ownerId: string) {
    const logSource = await this.logSourceService.getById(
      props.logSourceId,
      ownerId,
    );
    const remoteServer = await this.remoteServerService.getById(
      props.remoteServerId,
      ownerId,
    );

    const logScanerJob = this.repo.create({
      ...props,
      ownerId,
      status: LogScanerStatus.INITIALIZED,
      logSource,
      remoteServer,
    });

    return this.repo.save(logScanerJob);
  }

  findAll(ownerId: string) {
    return this.repo.find({ where: { ownerId } });
  }

  findOne(id: string, ownerId: string) {
    return this.repo.findOneBy({ id, ownerId });
  }

  async getById(id: string, ownerId: string) {
    const job = await this.findOne(id, ownerId);
    if (!job) {
      throw new NotFoundException('log job scaner not found');
    }

    return job;
  }

  async update(
    id: string,
    ownerId: string,
    updateLogScanerJobDto: UpdateLogScanerJobDto,
  ) {
    const job = await this.getById(id, ownerId);
    return this.repo.save({ ...job, ...updateLogScanerJobDto });
  }

  remove(id: string, ownerId: string) {
    return this.repo.delete({ id, ownerId });
  }
}
