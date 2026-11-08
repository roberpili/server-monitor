import { Test, TestingModule } from '@nestjs/testing';
import { LogScanerService } from './log-scaner.service.js';
import { LogScanerJobsService } from './log-scaner-jobs/log-scaner-jobs.service.js';
import { NotFoundException } from '@nestjs/common';
import { AnomalySeverity } from './log-scaner-jobs/entities/anomaly.entity.js';
import { Mocked } from 'vitest';

describe('LogScanerService', () => {
  let service: LogScanerService;
  let logScanerJobsService: Mocked<LogScanerJobsService>;

  const mockJob = {
    id: 'job-1',
    ownerId: 'user-123',
  } as any;

  const mockLogs = [
    {
      message: 'Error occurred',
      level: 'error',
      timestamp: '2024-01-01T00:00:00.000Z',
    },
    {
      message: 'Critical failure',
      level: 'critical',
      timestamp: '2024-01-01T00:00:01.000Z',
    },
    {
      message: 'Warning message',
      level: 'warn',
      timestamp: '2024-01-01T00:00:02.000Z',
    },
  ];

  beforeEach(async () => {
    const mockLogScanerJobsService = {
      findOne: vitest.fn(),
      addAnomaly: vitest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogScanerService,
        {
          provide: LogScanerJobsService,
          useValue: mockLogScanerJobsService,
        },
      ],
    }).compile();

    service = module.get<LogScanerService>(LogScanerService);
    logScanerJobsService = module.get(LogScanerJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ingestLogs', () => {
    it('should throw NotFoundException when job does not exist', async () => {
      logScanerJobsService.findOne.mockResolvedValue(null);

      await expect(
        service.ingestLogs('non-existent-job', 'user-123', mockLogs),
      ).rejects.toThrow(NotFoundException);
    });

    it('should process logs and create anomalies for error and critical levels', async () => {
      logScanerJobsService.findOne.mockResolvedValue(mockJob);
      logScanerJobsService.addAnomaly.mockResolvedValue(undefined);

      await service.ingestLogs('job-123', 'user-123', mockLogs);

      expect(logScanerJobsService.findOne).toHaveBeenCalledWith(
        'job-123',
        'user-123',
      );
      expect(logScanerJobsService.addAnomaly).toHaveBeenCalledTimes(3);

      // Check first call - error level
      expect(logScanerJobsService.addAnomaly).toHaveBeenNthCalledWith(
        1,
        mockJob,
        {
          title: 'Error occurred',
          severity: AnomalySeverity.HIGH,
        },
      );

      // Check second call - critical level
      expect(logScanerJobsService.addAnomaly).toHaveBeenNthCalledWith(
        2,
        mockJob,
        {
          title: 'Critical failure',
          severity: AnomalySeverity.CRITICAL,
        },
      );

      // Check third call - warn level defaults to HIGH
      expect(logScanerJobsService.addAnomaly).toHaveBeenNthCalledWith(
        3,
        mockJob,
        {
          title: 'Warning message',
          severity: AnomalySeverity.HIGH,
        },
      );
    });

    it('should use default message and level when not provided', async () => {
      logScanerJobsService.findOne.mockResolvedValue(mockJob);
      logScanerJobsService.addAnomaly.mockResolvedValue(undefined);

      const logsWithoutMessageOrLevel = [
        { timestamp: '2024-01-01T00:00:00.000Z' },
        { level: 'info', timestamp: '2024-01-01T00:00:01.000Z' },
      ];

      await service.ingestLogs(
        'job-123',
        'user-123',
        logsWithoutMessageOrLevel,
      );

      expect(logScanerJobsService.addAnomaly).toHaveBeenCalledTimes(2);
      expect(logScanerJobsService.addAnomaly).toHaveBeenNthCalledWith(
        1,
        mockJob,
        {
          title: 'untitled',
          severity: AnomalySeverity.HIGH,
        },
      );
      expect(logScanerJobsService.addAnomaly).toHaveBeenNthCalledWith(
        2,
        mockJob,
        {
          title: 'untitled',
          severity: AnomalySeverity.HIGH,
        },
      );
    });

    it('should handle empty logs array', async () => {
      logScanerJobsService.findOne.mockResolvedValue(mockJob);

      await service.ingestLogs('job-123', 'user-123', []);

      expect(logScanerJobsService.findOne).toHaveBeenCalledWith(
        'job-123',
        'user-123',
      );
      expect(logScanerJobsService.addAnomaly).not.toHaveBeenCalled();
    });
  });
});
