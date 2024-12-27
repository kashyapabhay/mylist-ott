import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    LoggerModule,
    MovieModule,
    MongooseModule.forRoot('mongodb+srv://dev:terminator_89@learning.y1x76.mongodb.net/test?retryWrites=true&w=majority'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
