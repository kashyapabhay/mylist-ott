export class UserServiceBaseException extends Error {
    baseErrorCode: string = '30';
    applicationErrorCode: string;
    constructor(errorCode: string,message: string) {
      super(message);
      this.applicationErrorCode = this.baseErrorCode + errorCode;
    }
  }
  