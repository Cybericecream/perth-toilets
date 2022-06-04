export enum Role {
    admin = "admin",
    generalUser = "general_user"
}

export interface LatestUserPassword {
    userId: string,
    passwordHash: string,
}

export interface UserPassword {
    userId: string,
    passwordHashed: string,
    passwordVersion: Number,
}

export interface LoginPasswordResponse {
    sessionToken: string,
    user: User,
}

export interface User {
    userId: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    userVersion: Number,
    role: Role,
    userRoleVersion: Number,
}

export interface UserRole {
    userId: string,
    role: Role,
    userRoleVersion: Number,
}

export interface UserSession {
    userId: string,
    sessionToken: string,
    expiry: string,
}