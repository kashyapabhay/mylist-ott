import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { MovieService } from './movie.service';
import { LoggerService } from 'src/logger/logger.service';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';

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

  @Post()
  createMovie(@Body() createMovieDto: CreateMovieDto) {
    this.loggerService.log('createMovie called');
    return this.movieService.create(createMovieDto);
  }

  @Put(':id')
  updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    this.loggerService.log(`updateMovie called with id ${id}`);
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    this.loggerService.log(`deleteMovie called with id ${id}`);
    return this.movieService.delete(+id);
  }
}