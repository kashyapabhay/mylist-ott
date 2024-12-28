import { MyListServiceBaseException } from './mylist.service.base.exception';

export const INVALID_CONTENT_ID_ERROR = "02";

export class InvalidContentIdException extends MyListServiceBaseException {
  constructor(message: string) {
          super(INVALID_CONTENT_ID_ERROR,message);
          this.name = "InvalidContentIdException";
          this.message=message;
      }
}
