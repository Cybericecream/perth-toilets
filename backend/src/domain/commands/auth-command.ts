import {validateString} from "../utils/validate-values";
import {User} from "../interfaces/auth-interfaces";

export class LoginCommand {
    constructor(
        readonly email: string,
        readonly password: string,
    ) {
        validateString(email);
        validateString(password);
    }
}

export class LogoutCommand {
    constructor(
        readonly sessionToken: string,
    ) {
        validateString(sessionToken);
    }
}

export class SignUpCommand {
    constructor(
        readonly user: User,
        readonly password: string,
    ) {
        validateString(user.email);
        validateString(user.username);
        validateString(user.firstName);
        validateString(user.lastName);
        validateString(password);
    }
}

export class ValidateSessionCommand {
    constructor(
        readonly sessionToken: string,
    ) {
        validateString(sessionToken);
    }
}