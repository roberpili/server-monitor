import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Mocked } from 'vitest';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
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

    service = module.get<UsersService>(UsersService);
    repo = module.get<Mocked<Repository<User>>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {} as any;
    repo.create.mockReturnValue(user);
    repo.save.mockResolvedValue(user);

    const result = await service.create({
      name: 'joe',
      email: 'joedoe@example.com',
    });

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith({
      name: 'joe',
      email: 'joedoe@example.com',
    });

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it('should find all users', async () => {
    const users = [] as any;
    repo.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });

  it('should find the user by id', async () => {
    const user = {} as any;
    repo.findOneBy.mockResolvedValue(user);

    const result = await service.findOne('13');

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: '13' });
    expect(result).toEqual(user);
  });

  it('should update the user', async () => {
    const user = {} as any;
    repo.findOneBy.mockResolvedValue(user);
    repo.save.mockResolvedValue(user);

    const updatedUser = {
      name: 'john2',
      email: 'johncena2@example.com',
    };

    const result = await service.update('13', updatedUser);

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: '13' });

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith({ ...user, ...updatedUser });
    expect(result).toEqual(user);
  });

  it('should throw and error if the user is not found', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(
      service.update('1', { name: 'test', email: 'test@example.com' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a user', async () => {
    await service.remove('1');

    expect(repo.delete).toHaveBeenCalledTimes(1);
    expect(repo.delete).toHaveBeenCalledWith('1');
  });
});
