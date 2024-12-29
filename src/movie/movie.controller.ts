import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { LoggerService } from 'src/logger/logger.service';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {

  constructor(
    private readonly movieService: MovieService,
    private readonly loggerService: LoggerService
  ) {}
  
  @Get(':id')
  getMovieById(@Param('id') id: string) {
    this.loggerService.log(`getMovieById called with id ${id}`);
    return this.movieService.getMovie(id);
  }

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    this.loggerService.log('createMovie called');
    return this.movieService.addMovie(createMovieDto);
  }

  @Put(':id')
  updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    this.loggerService.log(`updateMovie called with id ${id}`);
    return this.movieService.updateMovie(id, updateMovieDto);
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    this.loggerService.log(`deleteMovie called with id ${id}`);
    return this.movieService.deleteMovie(id);
  }
}