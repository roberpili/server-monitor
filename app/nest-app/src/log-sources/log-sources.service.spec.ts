import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { LogSourcesService } from './log-sources.service.js';
import {
  LogSource,
  LogSourceStatus,
  LogSourceType,
} from './entities/log-source.entity.js';
import { Mocked } from 'vitest';
import { Repository } from 'typeorm';

describe('LogSourcesService', () => {
  let service: LogSourcesService;
  let repo: Mocked<Repository<LogSource>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogSourcesService,
        {
          provide: getRepositoryToken(LogSource),
          useValue: {
            create: vitest.fn(),
            save: vitest.fn(),
            find: vitest.fn(),
            findOneBy: vitest.fn(),
            delete: vitest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LogSourcesService>(LogSourcesService);
    repo = module.get<Mocked<Repository<LogSource>>>(
      getRepositoryToken(LogSource),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a log source', async () => {
    const props = {} as any;
    const createdProps = {} as any;
    const savedProps = {} as any;
    repo.create.mockReturnValue(props);
    repo.save.mockResolvedValue(savedProps);

    // act
    const result = await service.create(props, '1');

    // assert
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith({
      ...props,
      ownerId: '1',
      status: LogSourceStatus.UNKNOWN,
    });
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(createdProps);
    expect(result).toEqual(savedProps);
  });

  it('should return all log sources for an owner', async () => {
    const ownerId = 'test-owner-id';
    const remoteServers = [] as any;
    repo.find.mockResolvedValue(remoteServers);

    const result = await service.findAll(ownerId);

    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(repo.find).toHaveBeenCalledWith({ where: { ownerId } });
    expect(result).toEqual(remoteServers);
  });

  it('should return a log source by id and owner', async () => {
    const id = 'uuid-123';
    const ownerId = 'test-owner-id';
    const remoteServer = {} as any;
    repo.findOneBy.mockResolvedValue(remoteServer);

    const result = await service.findOne(id, ownerId);

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id,
      ownerId,
    });
    expect(result).toEqual(remoteServer);
  });

  it('should return null when log source not found', async () => {
    const id = 'non-existent-id';
    const ownerId = 'test-owner-id';

    repo.findOneBy.mockResolvedValue(null);

    const result = await service.findOne(id, ownerId);

    expect(repo.findOneBy).toHaveBeenCalledWith({ id, ownerId });
    expect(result).toBeNull();
  });

  it('should return a log source by id and owner', async () => {
    const id = 'uuid-123';
    const ownerId = 'test-owner-id';
    const remoteServer = {
      id,
      ownerId,
      name: 'Test Log Source',
      description: 'Test description',
      config: { key: 'value' },
      type: LogSourceType.ZABBIX,
      status: LogSourceStatus.ONLINE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repo.findOneBy.mockResolvedValue(remoteServer);

    const result = await service.getById(id, ownerId);

    expect(repo.findOneBy).toHaveBeenCalledWith({ id, ownerId });
    expect(result).toEqual(remoteServer);
  });

  it('should throw NotFoundException when log source not found', async () => {
    const id = 'non-existent-id';
    const ownerId = 'test-owner-id';

    repo.findOneBy.mockResolvedValue(null);

    await expect(service.getById(id, ownerId)).rejects.toThrow(
      new NotFoundException('log source not found'),
    );
    expect(repo.findOneBy).toHaveBeenCalledWith({ id, ownerId });
  });

  it('should update a log source', async () => {
    const id = 'uuid-123';
    const ownerId = 'test-owner-id';
    const updateDto = {
      name: 'Updated Log Source',
      description: 'Updated description',
    };
    const existingLogSource = {
      id,
      ownerId,
      name: 'Original Log Source',
      description: 'Original description',
      config: { key: 'value' },
      type: LogSourceType.ZABBIX,
      status: LogSourceStatus.ONLINE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedLogSource = {
      ...existingLogSource,
      ...updateDto,
    };

    repo.findOneBy.mockResolvedValue(existingLogSource);
    repo.save.mockResolvedValue(updatedLogSource);

    // act
    const result = await service.update(id, ownerId, updateDto);

    // assert
    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id,
      ownerId,
    });

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(updatedLogSource);
    expect(result).toEqual(updatedLogSource);
  });

  it('should delete a log source', async () => {
    const logSource = {} as any;
    const deleteResponse = {} as any;

    repo.findOneBy.mockResolvedValue(logSource);
    repo.delete.mockResolvedValue(deleteResponse);

    const result = await service.remove('1', 'owner-1');

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: '1',
      ownerId: 'owner-1',
    });
    expect(repo.delete).toHaveBeenCalledTimes(1);
    expect(result).toEqual(deleteResponse);
  });
});
