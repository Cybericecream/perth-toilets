import {
    LatestUserPassword,
    NewUser,
    NewUserSession,
    User,
    UserPassword,
    UserRole,
    UserSession
} from "./auth-interfaces";

export interface UserRepository {
    loadUserById: (userId: string) => Promise<User>;
    loadUserByEmail: (email: string) => Promise<User>;
    saveUser: (user: User) => Promise<string>;
    saveUserRole: (userRole: UserRole) => Promise<void>;

    loadUserPassword: (userId: String) => Promise<LatestUserPassword>;
    saveUserPassword: (userPassword: UserPassword) => Promise<void>;
}

export interface UserSessionRepository {
    loadUserSession: (sessionToken: string) => Promise<UserSession>;
    saveUserSession: (newUserSession: NewUserSession) => Promise<void>;
    updateUserSession: (userSession: string, expiry: string) => Promise<void>;
    deleteUserSession: (userSession: string) => Promise<void>;
}