import { LogSource } from '@/log-sources/entities/log-source.entity.js';
import { RemoteServer } from '@/remote-servers/entities/remote-server.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Anomaly } from './anomaly.entity.js';

export enum LogScanerStatus {
  INITIALIZED = 'initialized',
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum LogScanerType {
  ONE_TIME = 'one_time',
  SCHEDULED = 'scheduled',
}

@Entity()
export class LogScanerJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  status: LogScanerStatus;

  @Column()
  type: LogScanerType;

  @Column({ nullable: true, type: 'simple-json' })
  ticketSystemConfig?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations
  @OneToOne(() => LogSource, { nullable: true })
  @JoinColumn()
  logSource?: LogSource;

  @OneToOne(() => RemoteServer)
  @JoinColumn()
  remoteServer: RemoteServer;

  @OneToMany(() => Anomaly, (anomaly) => anomaly.logScanerJob)
  anomalies: Anomaly[];
}
