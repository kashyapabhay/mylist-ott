import { NotFoundException } from '@nestjs/common';
import { MyListServiceBaseException } from './mylist.service.base.exception';

export const LIST_NOT_FOUND_ERROR = "01";

export class ListNotFoundException extends MyListServiceBaseException {
  constructor(message: string) {
          super(LIST_NOT_FOUND_ERROR,message);
          this.name = "ListNotFoundException";
          this.message=message;
      }
}
