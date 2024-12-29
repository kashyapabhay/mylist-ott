
export const USER_NOT_FOUND_ERROR = "5001";

    
export class RedisNotEnabledException extends Error {
    applicationErrorCode: string;
    constructor(message: string) {
        super(message);
        this.name = "UserNotFoundException";
        this.message=message;
        this.applicationErrorCode = USER_NOT_FOUND_ERROR;
    }
}
