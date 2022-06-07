import {LoginCommand} from "../commands/auth-command";
import {LatestUserPassword, LoginPasswordResponse, NewUserSession, User} from "../interfaces/auth-interfaces";
import {Hasher} from "../interfaces/hash-interface";
import {IncorrectPassword} from "../errors/auth-errors";
import {JwtInterface} from "../interfaces/jwt-interface";

// 28 Day Expiration
const now = new Date();
const expiryTime = now.setDate(now.getDate() + 28);

export const processLogin = async (command: LoginCommand, user: User, latestUserPassword: LatestUserPassword, hash: Hasher, jwt: JwtInterface): Promise<NewUserSession> => {
    const newLoginPass = hash.hashPassword(command.password);
    if (latestUserPassword.passwordHash !== newLoginPass) {
        throw new IncorrectPassword();
    }
    const sessionToken = jwt.generateSessionToken([], new Date(expiryTime));

    return {
        userId: user.userId,
        sessionToken: sessionToken,
        expiry: expiryTime.toString(),
    }
}