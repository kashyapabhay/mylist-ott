export class MyListServiceBaseException extends Error {
    baseErrorCode: string = '20';
    applicationErrorCode: string;
    constructor(errorCode: string,message: string) {
      super(message);
      this.applicationErrorCode = this.baseErrorCode + errorCode;
    }
  }