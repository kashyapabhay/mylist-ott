import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [LoggerModule, MovieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
