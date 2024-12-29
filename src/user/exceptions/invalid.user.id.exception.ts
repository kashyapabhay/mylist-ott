import { UserServiceBaseException } from "./user-service-base-exception";
import { INVALID_USER_ID_ERROR } from "./user.service.constants";

export class InvaldUserIdException extends UserServiceBaseException {
    
    constructor(message: string) {
        super(INVALID_USER_ID_ERROR,message);
        this.name = "UserNotFoundException";
        this.message=message;
    }
}
