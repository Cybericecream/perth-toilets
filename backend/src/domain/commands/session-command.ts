import {validateString, validateUuid} from "../utils/validate-values";

export class SaveSessionCommand {
    constructor(
        readonly userId: string,
        readonly sessionToken: string,
        readonly expiry: string,
    ) {
        validateUuid(userId);
        validateString(sessionToken);
        validateString(expiry);
    }
}

export class RemoveSessionCommand {
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