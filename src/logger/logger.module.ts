import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: () => new LoggerService('MyAppContext'),
    }],
  exports: [LoggerService],
})
export class LoggerModule { }