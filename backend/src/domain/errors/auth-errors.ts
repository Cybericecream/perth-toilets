export class NoPasswordFound extends Error {
    readonly name: string;

    constructor(
        message?: string
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class NoUserFound extends Error {
    readonly name: string;

    constructor(
        message?: string
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class NoSessionFound extends Error {
    readonly name: string;

    constructor(
        message?: string
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class DuplicatedUserPassword extends Error {
    readonly name: string;

    constructor(
        message?: string
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}