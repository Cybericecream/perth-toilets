import {LoginCommand, SignUpCommand} from "../commands/auth-command";
import {LatestUserPassword, NewUserSession, User, UserSession} from "../interfaces/auth-interfaces";
import {Hasher} from "../interfaces/hash-interface";
import {IncorrectPassword} from "../errors/auth-errors";
import {JwtInterface} from "../interfaces/jwt-interface";

// 7 Day Expiration
const expiryTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);

export const processLogin = async (command: LoginCommand, user: User, latestUserPassword: LatestUserPassword, hash: Hasher, jwt: JwtInterface): Promise<NewUserSession> => {
    const newLoginPass = hash.hashPassword(command.password);
    if (latestUserPassword.passwordHash !== newLoginPass) {
        throw new IncorrectPassword();
    }

    return {
        userId: user.userId,
        sessionToken: await sessionTokenGeneration(jwt),
        expiry: expiryTime.toString(),
    }
}

export const processSignUp = async (signUpCommand: SignUpCommand, hash: Hasher): Promise<string> => {
    return hash.hashPassword(signUpCommand.password);
}

export const processSession = async (userId: string, jwt: JwtInterface): Promise<NewUserSession> => {
    return {
        userId: userId,
        sessionToken: await sessionTokenGeneration(jwt),
        expiry: expiryTime.toString(),
    }
}

export const processValidSession = async (loadedSession: UserSession, jwt: JwtInterface): Promise<NewUserSession> => {
    jwt.verifySessionToken(loadedSession.sessionToken);

    return {
        userId: loadedSession.userId,
        sessionToken: loadedSession.sessionToken,
        expiry: expiryTime.toString(),
    }
}

const sessionTokenGeneration = async (jwt: JwtInterface): Promise<string> => {
    return jwt.generateSessionToken([], expiryTime);
}