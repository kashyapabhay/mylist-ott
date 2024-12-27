
export class MovieServiceBaseException extends Error {
  baseErrorCode: string = '10';
  applicationErrorCode: string;
  constructor(errorCode: string,message: string) {
    super(message);
    this.applicationErrorCode = this.baseErrorCode + errorCode;
  }
}
