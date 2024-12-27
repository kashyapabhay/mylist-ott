import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './movie.schema';
import { Model } from 'mongoose';

@Injectable()
export class MovieService {
    constructor(
        @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
        private readonly loggerService: LoggerService) { }
    findAll() {
        // logic to find all movies
        return ['Movie 1', 'Movie 2', 'Movie 3'];
    }

    findById(id: number) {
        // logic to find a movie by id
        this.loggerService.log(`findById called with id ${id}`);
        return `Movie with id ${id}`;
    }

    create(createMovieDto: CreateMovieDto): Promise<Movie> {
        // logic to create a new movie
        this.loggerService.log(`create movie called with title: ${createMovieDto.title}`);
        try {
            const createdMovie = this.movieModel.create(createMovieDto);
            return createdMovie;
        } catch (error) {
            this.loggerService.error(`Error creating movie: ${error.message}`, error.stack);
            throw error;
        }

    }

    update(id: number, updateMovieDto: UpdateMovieDto) {
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