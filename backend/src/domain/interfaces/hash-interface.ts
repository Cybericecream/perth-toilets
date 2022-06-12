export interface Hasher {
    hashPassword: (password: string) => string,
    generateUuid: () => string,
}