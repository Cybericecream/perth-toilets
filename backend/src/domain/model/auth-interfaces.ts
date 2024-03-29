import {Request} from "express";

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
    passwordVersion?: number,
}

export interface LoginPasswordResponse {
    sessionToken: string,
    user: User,
}

export interface User {
    userId?: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    userVersion?: number,
    role?: Role,
    userRoleVersion?: number,
}

export interface UserRole {
    userId: string,
    role: Role,
    userRoleVersion?: number,
}

export interface UserSession {
    userId: string,
    sessionToken: string,
}

export interface NewUserSession {
    userId: string,
    sessionToken: string,
    expiry: string,
}

export interface AuthRequest extends Request {
    session: UserSession;
}