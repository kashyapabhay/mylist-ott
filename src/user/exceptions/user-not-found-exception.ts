import { UserServiceBaseException } from "./user-service-base-exception";

export const USER_NOT_FOUND_ERROR = "01";

export class UserNotFoundException extends UserServiceBaseException {
    
    constructor(message: string) {
        super(USER_NOT_FOUND_ERROR,message);
        this.name = "UserNotFoundException";
        this.message=message;
    }
}
