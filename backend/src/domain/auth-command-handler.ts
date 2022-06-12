import {UserRepository, UserSessionRepository} from "./interfaces/auth-repository-interfaces";
import {LoginCommand, LogoutCommand, SignUpCommand, ValidateSessionCommand} from "./commands/auth-command";
import {LoginPasswordResponse, UserSession} from "./interfaces/auth-interfaces";
import {processLogin, processSession, processSignUp, processValidSession} from "./processors/process-auth";
import {Hasher} from "./interfaces/hash-interface";
import {JwtInterface} from "./interfaces/jwt-interface";

export class AuthUserPasswordCommandHandler {
    constructor(
        protected readonly userRepository: UserRepository,
        protected readonly sessionRepository: UserSessionRepository,
        protected readonly hash: Hasher,
        protected readonly jwt: JwtInterface,
    ) {
    }

    handleLogin = async (loginCommand: LoginCommand): Promise<LoginPasswordResponse> => {
        const loadedUser = await this.userRepository.loadUserByEmail(loginCommand.email);
        const loadedLatestUserLogin = await this.userRepository.loadUserPassword(loadedUser.userId);
        const processedLogin = await processLogin(loginCommand, loadedUser, loadedLatestUserLogin, this.hash, this.jwt)
        await this.sessionRepository.saveUserSession(processedLogin);
        return {
            sessionToken: processedLogin.sessionToken,
            user: loadedUser,
        }
    }

    handleLogout = async (logoutCommand: LogoutCommand): Promise<void> => {
        await this.sessionRepository.loadUserSession(logoutCommand.sessionToken);
        await this.sessionRepository.deleteUserSession(logoutCommand.sessionToken);
    }

    handleSignUp = async (signUpCommand: SignUpCommand): Promise<LoginPasswordResponse> => {
        signUpCommand.user.userId = await this.userRepository.saveUser(signUpCommand.user);
        await this.userRepository.saveUserRole({
            userId: signUpCommand.user.userId,
            role: signUpCommand.user.role
        });
        const processedSignUp = await processSignUp(signUpCommand, this.hash);
        await this.userRepository.saveUserPassword({
            userId: signUpCommand.user.userId,
            passwordHashed: processedSignUp
        });
        const processedSession = await processSession(signUpCommand.user.userId, this.jwt);
        return {
            sessionToken: processedSession.sessionToken,
            user: signUpCommand.user,
        }
    }

    handleValidSession = async (validateSessionCommand: ValidateSessionCommand): Promise<UserSession> => {
        const loadedSession = await this.sessionRepository.loadUserSession(validateSessionCommand.sessionToken);
        const updatedSession = await processValidSession(loadedSession, this.jwt);
        await this.sessionRepository.updateUserSession(updatedSession.sessionToken, updatedSession.expiry);

        return loadedSession;
    }
}