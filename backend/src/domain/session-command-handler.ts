import {UserSessionRepository} from "./interfaces/auth-repository-interfaces";
import {RemoveSessionCommand, SaveSessionCommand, ValidateSessionCommand} from "./commands/session-command";
import {UserSession} from "./interfaces/auth-interfaces";
import {processValidSession} from "./processors/process-auth";
import {JwtInterface} from "./interfaces/jwt-interface";

export class SessionCommandHandler {
    constructor(
        protected readonly sessionRepository: UserSessionRepository,
        protected readonly jwt: JwtInterface,
    ) {
    }

    handleSaveSession = async (saveSessionCommand: SaveSessionCommand) => {
        await this.sessionRepository.saveUserSession(saveSessionCommand);
    }

    handleRemoveSession = async (removeSessionCommand: RemoveSessionCommand) => {
        await this.sessionRepository.loadUserSession(removeSessionCommand.sessionToken);
        await this.sessionRepository.deleteUserSession(removeSessionCommand.sessionToken);
    }

    handleValidSession = async (validateSessionCommand: ValidateSessionCommand): Promise<UserSession> => {
        const loadedSession = await this.sessionRepository.loadUserSession(validateSessionCommand.sessionToken);
        const updatedSession = await processValidSession(loadedSession, this.jwt);
        await this.sessionRepository.updateUserSession(updatedSession.sessionToken, updatedSession.expiry);

        return loadedSession;
    }
}