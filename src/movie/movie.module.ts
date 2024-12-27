import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService,LoggerService],
})
export class MovieModule {}