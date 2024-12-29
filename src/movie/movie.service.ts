import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieNotFoundException } from './exceptions/movie.not.found.exception';
import { Movie } from './movie.interface';

@Injectable()
export class MovieService {
    constructor(
        @InjectModel('Movie') private readonly movieModel: Model<Movie>,
        private readonly loggerService: LoggerService) { }


    async getMovie(id: string): Promise<Movie> {
        this.loggerService.log(`findById called with id ${id}`);
        try {
            const movie = await this.movieModel.findById(id).exec();
            if (!movie) {
                throw new MovieNotFoundException('Movie not found');
            }
            return movie;
        } catch (error) {
            this.loggerService.error(`Error finding movie: ${error.message}`, error.stack);
            throw error;
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
            throw error;
        }

    }

    async updateMovie(id: string, updateMovieDto: UpdateMovieDto) : Promise<Movie> {
        // logic to update a movie by id
        this.loggerService.log(`update movie called with id ${id} and title ${updateMovieDto.title}`);
        try {
            const updatedMovie = await this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true }).exec();
            if (!updatedMovie) {
                throw new MovieNotFoundException('Movie not found');
            }
            return updatedMovie;
        } catch (error) {
            this.loggerService.error(`Error updating movie: ${error.message}`, error.stack);
            throw error;
        }
    }

    async deleteMovie(movieId: string): Promise<void> {
        // logic to delete a movie by id
        try {
            const result = await this.movieModel.findByIdAndDelete(movieId);
            if (!result) {
                throw new Error('Movie not found');
            }
        } catch (error) {
            this.loggerService.error(`Error deleting movie: ${error.message}`, error.stack);
            throw error;
        }
    }
}