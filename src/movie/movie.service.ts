import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';

@Injectable()
export class MovieService {
    constructor(private readonly loggerService: LoggerService) { }
    findAll() {
        // logic to find all movies
        return ['Movie 1', 'Movie 2', 'Movie 3'];
    }

    findById(id: number) {
        // logic to find a movie by id
        this.loggerService.log(`findById called with id ${id}`);
        return `Movie with id ${id}`;
    }

    create(createMovieDto: CreateMovieDto) {
        // logic to create a new movie
        this.loggerService.log(`create movie called with title: ${createMovieDto.title}`);
        return `Movie  created`;
    }

    update(id: number, updateMovieDto : UpdateMovieDto) {
        // logic to update a movie by id
        this.loggerService.log(`update movie called with id ${id} and title ${updateMovieDto.title}`);
        return `Movie with id ${id} updated to ${updateMovieDto.title}`;
    }

    delete(id: number) {
        // logic to delete a movie by id
        this.loggerService.log(`delete called with id ${id}`);
        return `Movie with id ${id} deleted`;
    }
}