import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemoteServersModule } from './remote-servers/remote-servers.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LogSourcesModule } from './log-sources/log-sources.module.js';
import { LogScanerModule } from './log-scaner/log-scaner.module.js';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sql',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RemoteServersModule,
    AuthModule,
    LogSourcesModule,
    LogScanerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
