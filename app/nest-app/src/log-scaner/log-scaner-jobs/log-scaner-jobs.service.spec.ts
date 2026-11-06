import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { LogScanerJobsService } from './log-scaner-jobs.service.js';
import {
  LogScanerJob,
  LogScanerStatus,
  LogScanerType,
} from './entities/log-scaner-job.entity.js';

import { Mocked } from 'vitest';
import { Repository } from 'typeorm';
import { LogSourcesService } from '@/log-sources/log-sources.service.js';
import { RemoteServersService } from '@/remote-servers/remote-servers.service.js';
import { CreateLogScanerJobDto } from './dto/create-log-scaner-job.dto.js';

describe('LogScanerJobsService', () => {
  let service: LogScanerJobsService;
  let repo: Mocked<Repository<LogScanerJob>>;
  let logSourceService: Mocked<LogSourcesService>;
  let remoteServerService: Mocked<RemoteServersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogScanerJobsService,
        {
          provide: getRepositoryToken(LogScanerJob),
          useValue: {
            create: vitest.fn(),
            save: vitest.fn(),
            find: vitest.fn(),
            findOneBy: vitest.fn(),
            delete: vitest.fn(),
          },
        },
        {
          provide: LogSourcesService,
          useValue: {
            findOne: vitest.fn(),
          },
        },
        {
          provide: RemoteServersService,
          useValue: {
            findOne: vitest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LogScanerJobsService>(LogScanerJobsService);
    repo = module.get<Mocked<Repository<LogScanerJob>>>(
      getRepositoryToken(LogScanerJob),
    );
    logSourceService = module.get<Mocked<LogSourcesService>>(LogSourcesService);
    remoteServerService =
      module.get<Mocked<RemoteServersService>>(RemoteServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a log scaner job', async () => {
    const createDto: CreateLogScanerJobDto = {
      name: 'test',
      type: LogScanerType.ONE_TIME,
      logSourceId: 'log-source-1',
      remoteServerId: 'remote-server-1',
    };
    const createdJob = {} as any;
    const savedJob = {} as any;
    repo.create.mockReturnValue(createdJob);
    repo.save.mockResolvedValue(savedJob);

    logSourceService.findOne.mockResolvedValue('log-source' as any);
    remoteServerService.findOne.mockResolvedValue('remote-server' as any);

    // act
    const result = await service.create(createDto, 'owner-1');

    // assert
    expect(logSourceService.findOne).toHaveBeenCalledTimes(1);
    expect(logSourceService.findOne).toHaveBeenCalledWith(
      'log-source-1',
      'owner-1',
    );
    expect(remoteServerService.findOne).toHaveBeenCalledTimes(1);
    expect(remoteServerService.findOne).toHaveBeenCalledWith(
      'remote-server-1',
      'owner-1',
    );
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith({
      ...createDto,
      ownerId: 'owner-1',
      status: LogScanerStatus.INITIALIZED,
      logSource: 'log-source' as any,
      remoteServer: 'remote-server' as any,
    });
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(createdJob);
    expect(result).toEqual(savedJob);
  });

  it('should not throw error if log source not provided', async () => {
    const createDto: CreateLogScanerJobDto = {
      name: 'test',
      type: LogScanerType.ONE_TIME,
      remoteServerId: 'remote-server-1',
    };

    const createdJob = {} as any;
    const savedJob = {} as any;

    repo.create.mockReturnValue(createdJob);
    repo.save.mockResolvedValue(savedJob);

    remoteServerService.findOne.mockResolvedValue('remote-server' as any);
    await service.create(createDto, 'owner-1');

    expect(logSourceService.findOne).toHaveBeenCalledTimes(0);
  });

  it('should return all log scaner jobs for an owner', async () => {
    const jobs = [] as any;
    repo.find.mockResolvedValue(jobs);

    const result = await service.findAll('owner-1');

    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(repo.find).toHaveBeenCalledWith({ where: { ownerId: 'owner-1' } });
    expect(result).toEqual(jobs);
  });

  it('should return a log scaner job by id and owner', async () => {
    const job = {} as any;
    repo.findOneBy.mockResolvedValue(job);

    const result = await service.getById('job-1', 'owner-1');

    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: 'job-1',
      ownerId: 'owner-1',
    });
    expect(result).toEqual(job);
  });

  it('should return null when log scaner job not found', async () => {
    repo.findOneBy.mockResolvedValue(null);

    const result = await service.findOne('1', 'owner-1');

    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: '1',
      ownerId: 'owner-1',
    });
    expect(result).toBeNull();
  });

  it('should throw NotFoundException when log scaner job not found', async () => {
    const id = 'non-existent-id';
    const ownerId = 'test-owner-id';

    repo.findOneBy.mockResolvedValue(null);

    await expect(service.getById(id, ownerId)).rejects.toThrow(
      new NotFoundException('log job scaner not found'),
    );
    expect(repo.findOneBy).toHaveBeenCalledWith({ id, ownerId });
  });

  it('should update a log scaner job', async () => {
    const logScanerJob = {} as any;
    const updatedJob = {} as any;
    repo.findOneBy.mockResolvedValue(logScanerJob);
    repo.save.mockResolvedValue(updatedJob);

    const updateDto = {
      name: 'Updated Job',
      description: 'Updated description',
    };
    const result = await service.update('job-1', 'owner-1', updateDto);

    // assert
    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: 'job-1',
      ownerId: 'owner-1',
    });
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith({
      ...logScanerJob,
      ...updateDto,
    });
    expect(result).toEqual(updatedJob);
  });

  it('should delete a log scaner job', async () => {
    const deleteResponse = {} as any;

    repo.delete.mockResolvedValue(deleteResponse);

    const result = await service.remove('job-1', 'owner-1');

    expect(repo.delete).toHaveBeenCalledTimes(1);
    expect(repo.delete).toHaveBeenCalledWith({
      id: 'job-1',
      ownerId: 'owner-1',
    });
    expect(result).toEqual(deleteResponse);
  });
});
