import { Controller, Get, Param } from '@nestjs/common';
import { MovieService } from './movie.service';
import { LoggerService } from 'src/logger/logger.service';

@Controller('movies')
export class MovieController {

  constructor(
    private readonly movieService: MovieService,
    private readonly loggerService: LoggerService
  ) {}
  @Get()
  getAllMovies() {
    return this.movieService.findAll();
  }

  @Get(':id')
  getMovieById(@Param('id') id: string) {
    this.loggerService.log(`getMovieById called with id ${id}`);
    return this.movieService.findById(+id);
  }
}