import {
  Column,
  Entity,
  EntitySchema,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { LogScanerJob } from './log-scaner-job.entity.js';

export enum AnomalySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AnomalyStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  IN_PROGRESS = 'in_progress',
}

@Entity()
export class Anomaly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: AnomalyStatus;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  severity: AnomalySeverity;

  @Column({ nullable: true, type: 'simple-json' })
  ticketInfo?: Record<string, any>;

  @ManyToOne(() => LogScanerJob, (logScanerJob) => logScanerJob.anomalies, {
    onDelete: 'CASCADE',
  })
  logScanerJob: Relation<LogScanerJob>;
}
