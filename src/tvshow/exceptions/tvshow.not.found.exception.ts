import { TVSHOW_NOT_FOUND_ERROR } from "../tvshow.module.constants";
import { TVShowServiceBaseException } from "./tvshow.service.base.exception";

export class TVShowNotFoundException extends TVShowServiceBaseException {
    
    constructor(message: string) {
        super(TVSHOW_NOT_FOUND_ERROR,message);
        this.name = "TVShowNotFoundException";
        this.message=message;
    }
}
