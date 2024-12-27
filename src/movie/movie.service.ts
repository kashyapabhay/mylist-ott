import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

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
}