import {LatestUserPassword, NewUserSession, User, UserPassword, UserRole, UserSession} from "./auth-interfaces";

export interface UserRepository {
    loadUserById: (userId: string) => Promise<User>;
    loadUserByEmail: (email: string) => Promise<User>;
    saveUser: (user: User) => Promise<void>;
    saveUserRole: (userRole: UserRole) => Promise<void>;

    loadUserPassword: (userId: String) => Promise<LatestUserPassword>;
    saveUserPassword: (userPassword: UserPassword) => Promise<void>;
}

export interface UserSessionRepository {
    loadUserSession: (userId: string, sessionToken: string) => Promise<UserSession>;
    saveUserSession: (newUserSession: NewUserSession) => Promise<void>;
}