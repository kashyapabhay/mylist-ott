import { MovieServiceBaseException } from "./movie.service.base.exception";

export const MOVIE_NOT_FOUND_ERROR = "01";

export class MovieNotFoundException extends MovieServiceBaseException {
    
    constructor(message: string) {
        super(MOVIE_NOT_FOUND_ERROR,message);
        this.name = "MovieNotFoundException";
        this.message=message;
    }
}
