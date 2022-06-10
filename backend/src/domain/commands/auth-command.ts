import {validateString} from "../utils/validate-values";

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

export class ValidateSessionCommand {
    constructor(
        readonly sessionToken: string,
    ) {
        validateString(sessionToken);
    }
}