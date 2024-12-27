import { TVShowServiceBaseException } from "./tvshow.service.base.exception";

export const TVSHOW_NOT_FOUND_ERROR = "01";

export class TVShowNotFoundExceptin extends TVShowServiceBaseException {
    
    constructor(message: string) {
        super(TVSHOW_NOT_FOUND_ERROR,message);
        this.name = "TVShowNotFoundException";
        this.message=message;
    }
}
