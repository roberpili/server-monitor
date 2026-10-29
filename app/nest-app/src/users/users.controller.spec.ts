import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { mock } from 'node:test';
import { Mocked } from 'vitest';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: vitest.fn(),
            findOne: vitest.fn(),
            create: vitest.fn(),
            update: vitest.fn(),
            remove: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<Mocked<UsersService>>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {} as any;
    service.create.mockResolvedValue(user);

    const createUserDTO = {
      name: 'john',
      email: 'johncena@example.com',
    };

    const result = await controller.create(createUserDTO);

    expect(service.create).toHaveBeenCalledTimes(1);
    expect(service.create).toHaveBeenCalledWith(createUserDTO);
    expect(result).toEqual(user);
  });

  it('should find all users', async () => {
    const users = [] as any;
    service.findAll.mockResolvedValue(users);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });

  it('should find the user by id', async () => {
    const user = {} as any;
    service.findOne.mockResolvedValue(user);

    const result = await controller.findOne('13');

    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(service.findOne).toHaveBeenCalledWith('13');
    expect(result).toEqual(user);
  });

  it('should update the user', async () => {
    const user = {} as any;
    service.update.mockResolvedValue(user);

    const updatedUser = {
      name: 'john2',
      email: 'johncena2@example.com',
    };

    const result = await controller.update('13', updatedUser);

    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith('13', updatedUser);
    expect(result).toEqual(user);
  });

  it('should remove the user', async () => {
    const user = {} as any;
    service.remove.mockResolvedValue(user);

    const result = await controller.remove('13');

    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(service.remove).toHaveBeenCalledWith('13');
    expect(result).toEqual(user);
  });
});
