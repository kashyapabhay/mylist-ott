import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { LoggerService } from 'src/logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'src/logger/logger.module';
import { Movie, MovieSchema } from './movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    LoggerModule,
  ],
  controllers: [MovieController],
  providers: [MovieService,LoggerService],
})
export class MovieModule {}