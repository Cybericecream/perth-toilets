export const isValidUuid = (uuid: string) => {
    return uuid.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$") !== null;
}

export const isValidString = (stringVar: string) => {
    return (typeof stringVar === 'string' && stringVar.length > 0);
}

export const isValidNumber = (numberVar: number) => {
    return (numberVar > 0);
}

export const validateUuid = (uuid: string) => {
    if (!isValidUuid(uuid)) {
        throw new Error("UUID is not Valid.");
    }
}

export const validateString = (stringVar: string) => {
    if (!isValidString(stringVar)) {
        throw new Error("String is not Valid string.");
    }
}

export const validateNumber = (numberVar: number) => {
    if (!isValidNumber(numberVar)) {
        throw new Error("Number is not Valid number.");
    }
}