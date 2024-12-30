import { MyListServiceBaseException } from './mylist.service.base.exception';

export const INVALID_CONTENT_ID_ERROR = "02";

export class InvalidContentIdException extends MyListServiceBaseException {

  constructor(message: string, error: Error) {
    super(INVALID_CONTENT_ID_ERROR, message);
    this.name = "InvalidContentIdException";
    this.message = message;
    if (error !== null) {
      this.stack = error.stack;
    }else {
      this.stack = new Error().stack;
    }
  }

}
