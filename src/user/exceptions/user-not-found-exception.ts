import { UserServiceBaseException } from "./user-service-base-exception";
import { USER_NOT_FOUND_ERROR } from "./user.service.constants";


export class UserNotFoundException extends UserServiceBaseException {
    
    constructor(message: string) {
        super(USER_NOT_FOUND_ERROR,message);
        this.name = "UserNotFoundException";
        this.message=message;
    }
}
