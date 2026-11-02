import { Test, TestingModule } from '@nestjs/testing';
import { RemoteServersService } from './remote-servers.service.js';
import { Mocked } from 'vitest';
import { Repository } from 'typeorm';
import {
  RemoteServer,
  RemoteServerStatus,
} from './entities/remote-server.entity.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('RemoteServersService', () => {
  let service: RemoteServersService;
  let repo: Mocked<Repository<RemoteServer>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoteServersService,
        {
          provide: getRepositoryToken(RemoteServer),
          useValue: {
            create: vitest.fn(),
            save: vitest.fn(),
            findOneBy: vitest.fn(),
            find: vitest.fn(),
            findAll: vitest.fn(),
            findOne: vitest.fn(),
            update: vitest.fn(),
            delete: vitest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RemoteServersService>(RemoteServersService);
    repo = module.get<Mocked<Repository<RemoteServer>>>(
      getRepositoryToken(RemoteServer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a remote server', async () => {
    const props = {} as any;
    const createdProps = {} as any;
    const savedProps = {} as any;
    repo.save.mockResolvedValue(createdProps);
    repo.create.mockReturnValue(props);

    // act
    const result = await service.create(props, '1');

    // assert
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith({
      ...props,
      ownerId: '1',
      status: RemoteServerStatus.UNKNOWN,
    });
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(createdProps);
    expect(result).toEqual(savedProps);
  });

  it('should find all remote servers', async () => {
    const remoteServers = [] as any;
    repo.find.mockResolvedValue(remoteServers);

    const result = await service.findAll('1');

    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(repo.find).toHaveBeenCalledWith({ where: { ownerId: '1' } });
    expect(result).toEqual(remoteServers);
  });

  it('should find the remoteServer by id', async () => {
    const remoteServer = {} as any;
    repo.findOneBy.mockResolvedValue(remoteServer);

    const result = await service.findOne('13', 'owner-1');

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: '13',
      ownerId: 'owner-1',
    });
    expect(result).toEqual(remoteServer);
  });

  it('should update the remote server', async () => {
    const remoteServer = {} as any;
    repo.findOneBy.mockResolvedValue(remoteServer);
    repo.save.mockResolvedValue(remoteServer);

    // act
    const updatedProps = {
      name: 'test',
    };
    const result = await service.update('1', updatedProps, 'owner-1');

    // assert
    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: '1',
      ownerId: 'owner-1',
    });

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith({ ...remoteServer, name: 'test' });
    expect(result).toEqual(remoteServer);
  });

  it('should throw and error if the remote server is not found', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(
      service.update('1', { name: 'test' }, 'owner-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a user', async () => {
    const remoteServer = {} as any;
    const deletedResponse = {} as any;
    repo.findOneBy.mockResolvedValue(remoteServer);
    repo.delete.mockResolvedValue(deletedResponse);

    const result = await service.remove('1', 'owner-1');

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: '1',
      ownerId: 'owner-1',
    });
    expect(repo.delete).toHaveBeenCalledTimes(1);
    expect(result).toEqual(deletedResponse);
  });
});
