import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TVShowService } from './tvshow.service';
import { TVShowController } from './tvshow.controller';
import { TVShowSchema } from './tvshow.schema';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TVShow', schema: TVShowSchema }]),
    LoggerModule,
  ],
  controllers: [TVShowController],
  providers: [TVShowService, LoggerService],
  exports: [TVShowService],
})
export class TVShowModule implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('TVShowModule has been initialized.');
  }

  onModuleDestroy() {
    console.log('TVShowModule is being destroyed.');
  }
}
