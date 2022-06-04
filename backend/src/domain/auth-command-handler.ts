import {UserRepository} from "./interfaces/auth-repository-interfaces";
import {LoginCommand} from "./commands/auth-command";
import {LoginPasswordResponse} from "./interfaces/auth-interfaces";
import {processLogin} from "./processors/process-auth";

export class AuthUserPasswordCommandHandler {
    constructor(
        protected readonly repository: UserRepository,
        protected readonly hash:
    ) {
    }

    handleLogin = async (loginCommand: LoginCommand): Promise<LoginPasswordResponse> => {
        const loadedUser = await this.repository.loadUserByEmail(loginCommand.email);
        const loadedLatestUserLogin = await this.repository.loadUserPassword(loadedUser.userId);
        const processedLogin = await processLogin
    }

}