
export const DATABASE_EXCEPTION = "5001";

    
export class DatabaseException extends Error {
    applicationErrorCode: string;
    constructor(message: string,error : Error ) {
        super(message);
        this.name = "DatabaseException";
        this.message=message;
        this.stack = error.stack;
        this.applicationErrorCode = DATABASE_EXCEPTION;
    }
}
