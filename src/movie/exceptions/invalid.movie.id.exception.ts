import { INVALID_MOVIE_ID_ERROR } from "../movie.module.constants";
import { MovieServiceBaseException } from "./movie.service.base.exception";

export class InvaldMovieIdException extends MovieServiceBaseException {
    
    constructor(message: string) {
        super(INVALID_MOVIE_ID_ERROR,message);
        this.name = "UserNotFoundException";
        this.message=message;
    }
}
