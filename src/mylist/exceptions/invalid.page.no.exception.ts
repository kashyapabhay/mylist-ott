import { MyListServiceBaseException } from './mylist.service.base.exception';

export const INVALID_PAGE_NO_ERROR = "04";

export class InvalidPageNumberException extends MyListServiceBaseException {

  constructor(message: string) {
    super(INVALID_PAGE_NO_ERROR, message);
    this.name = "InvalidPageNoException";
    this.message = message;
  }

}