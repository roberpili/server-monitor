import { Test, TestingModule } from '@nestjs/testing';
import { LogScanerController } from './log-scaner.controller.js';

describe('LogScanerController', () => {
  let controller: LogScanerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogScanerController],
    }).compile();

    controller = module.get<LogScanerController>(LogScanerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
