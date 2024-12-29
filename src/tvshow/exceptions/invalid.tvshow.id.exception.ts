import { INVALID_TVSHOW_ID_ERROR } from "../tvshow.module.constants";
import { TVShowServiceBaseException } from "./tvshow.service.base.exception";

export class InvalidTVShowIdException extends TVShowServiceBaseException {
    
    constructor(message: string) {
        super(INVALID_TVSHOW_ID_ERROR,message);
        this.name = "InvalidTVShowIdException";
        this.message=message;
    }
}
