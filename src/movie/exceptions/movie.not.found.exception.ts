import { MOVIE_NOT_FOUND_ERROR } from "../movie.module.constants";
import { MovieServiceBaseException } from "./movie.service.base.exception";


export class MovieNotFoundException extends MovieServiceBaseException {
    
    constructor(message: string) {
        super(MOVIE_NOT_FOUND_ERROR,message);
        this.name = "MovieNotFoundException";
        this.message=message;
    }
}
