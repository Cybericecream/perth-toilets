import {LoginCommand} from "../commands/auth-command";
import {LatestUserPassword, NewUserSession, User, UserSession} from "../interfaces/auth-interfaces";
import {Hasher} from "../interfaces/hash-interface";
import {IncorrectPassword} from "../errors/auth-errors";
import {JwtInterface} from "../interfaces/jwt-interface";

// 28 Day Expiration
const expiryTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 28);

export const processLogin = async (command: LoginCommand, user: User, latestUserPassword: LatestUserPassword, hash: Hasher, jwt: JwtInterface): Promise<NewUserSession> => {
    const newLoginPass = hash.hashPassword(command.password);
    if (latestUserPassword.passwordHash !== newLoginPass) {
        throw new IncorrectPassword();
    }
    const sessionToken = jwt.generateSessionToken([], expiryTime);

    return {
        userId: user.userId,
        sessionToken: sessionToken,
        expiry: expiryTime.toString(),
    }
}

export const processValidSession = async (loadedSession: UserSession, jwt: JwtInterface): Promise<void> => {
    jwt.verifySessionToken(loadedSession.sessionToken);
}