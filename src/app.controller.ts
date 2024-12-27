import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';

@Controller('base')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly loggerService: LoggerService
  ) {}

  @Get()
  getHello(): string {
    this.loggerService.log('getHello called');
    return this.appService.getHello();
  }
}
