import { MyListServiceBaseException } from "./mylist.service.base.exception";

export const INVALID_CONTENT_TYPE_ERROR = "03";

export class InvalidContentTypeException extends MyListServiceBaseException {
  constructor(message: string) {
          super(INVALID_CONTENT_TYPE_ERROR,message);
          this.name = "InvalidContentTypeException";
          this.message=message;
      }
}
