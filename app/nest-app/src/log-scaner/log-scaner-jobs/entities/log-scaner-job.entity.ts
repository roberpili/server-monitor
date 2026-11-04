import { LogSource } from '@/log-sources/entities/log-source.entity.js';
import { RemoteServer } from '@/remote-servers/entities/remote-server.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations
  @OneToOne(() => LogSource)
  @JoinColumn()
  logSource: LogSource;

  @OneToOne(() => RemoteServer)
  @JoinColumn()
  remoteServer: RemoteServer;
}
