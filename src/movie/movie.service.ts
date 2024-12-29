import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieNotFoundException } from './exceptions/movie.not.found.exception';
import { Movie } from './movie.interface';
import { InvaldMovieIdException } from './exceptions/invalid.movie.id.exception';
import { DatabaseException } from 'src/exceptions/database.exception';

@Injectable()
export class MovieService {
    private readonly loggerService: LoggerService;
    constructor(
        @InjectModel('Movie') private readonly movieModel: Model<Movie>) {
        this.loggerService = new LoggerService('MovieService');
    }


    async getMovie(id: string): Promise<Movie> {
        this.loggerService.log(`Get movied called with id ${id}`);
        if (id === undefined || id === null) {
            throw new InvaldMovieIdException('Movie id cannot be null or undefined');
        }
        try {
            const movie = await this.movieModel.findById(id);
            if (!movie) {
                throw new MovieNotFoundException('Movie not found');
            }
            return movie;
        } catch (error) {
            if (error instanceof MovieNotFoundException) {
                this.loggerService.error(`Movie not found: ${id}`, error.stack);
                throw error;
            }
            this.loggerService.error(`Error finding movie: ${error.message}`, error.stack);
            throw new DatabaseException(`Error while fetching movie: ${id}`, error);
        }
    }

    async addMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
        // logic to create a new movie
        this.loggerService.log(`create movie called with title: ${createMovieDto.title}`);
        try {
            const createdMovie = this.movieModel.create(createMovieDto);
            return createdMovie;
        } catch (error) {
            this.loggerService.error(`Error creating movie: ${error.message}`, error.stack);
            throw new DatabaseException(`Error while creating movie with title ${createMovieDto.title}`, error);
        }

    }

    async updateMovie(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
        // logic to update a movie by id
        this.loggerService.log(`update movie called with id ${id} and title ${updateMovieDto.title}`);
        if (id === undefined || id === null) {
            throw new InvaldMovieIdException('Movie id cannot be null or undefined');
        }
        try {
            const updatedMovie = await this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true });
            if (!updatedMovie) {
                throw new MovieNotFoundException('Movie not found');
            }
            return updatedMovie;
        } catch (error) {
            this.loggerService.error(`Error updating movie: ${error.message}`, error.stack);
            throw new DatabaseException(`Error while updating movie with id ${id}`, error);

        }
    }

    async deleteMovie(movieId: string): Promise<void> {
        // logic to delete a movie by id
        if (movieId === undefined || movieId === null) {
            throw new InvaldMovieIdException('Movie id cannot be null or undefined');
        }
        try {
            const result = await this.movieModel.findByIdAndDelete(movieId);
            if (!result) {
                throw new MovieNotFoundException('Movie not found');
            }
        } catch (error) {
            this.loggerService.error(`Error deleting movie: ${error.message}`, error.stack);
            if (error instanceof MovieNotFoundException) {
                throw error;
            }
            throw new DatabaseException(`Error while deleting movie with id ${movieId}`, error);
        }
    }
}