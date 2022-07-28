import {UserRepository} from "./model/auth-repository-interfaces";
import {LoginCommand, LogoutCommand, SignUpCommand} from "./commands/auth-command";
import {LoginPasswordResponse} from "./model/auth-interfaces";
import {processLogin, processSession, processSignUp} from "./processors/process-auth";
import {Hasher} from "./model/hash-interface";
import {JwtInterface} from "./model/jwt-interface";
import {SessionCommandHandler} from "./session-command-handler";
import {RemoveSessionCommand, SaveSessionCommand} from "./commands/session-command";

export class AuthUserPasswordCommandHandler {
    constructor(
        protected readonly userRepository: UserRepository,
        protected readonly sessionCommandHandler: SessionCommandHandler,
        protected readonly hash: Hasher,
        protected readonly jwt: JwtInterface,
    ) {
    }

    handleLogin = async (loginCommand: LoginCommand): Promise<LoginPasswordResponse> => {
        const loadedUser = await this.userRepository.loadUserByEmail(loginCommand.email);
        const loadedLatestUserLogin = await this.userRepository.loadUserPassword(loadedUser.userId);
        const processedLogin = await processLogin(loginCommand, loadedUser, loadedLatestUserLogin, this.hash, this.jwt)
        const newSession = new SaveSessionCommand(processedLogin.userId, processedLogin.sessionToken, processedLogin.expiry);
        await this.sessionCommandHandler.handleSaveSession(newSession);
        return {
            sessionToken: processedLogin.sessionToken,
            user: loadedUser,
        }
    }

    handleLogout = async (logoutCommand: LogoutCommand): Promise<void> => {
        const removeSession = new RemoveSessionCommand(logoutCommand.sessionToken);
        await this.sessionCommandHandler.handleRemoveSession(removeSession);
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
}