import {Ledger} from "../pool";
import {UserSessionRepository} from "../../../domain/model/auth-repository-interfaces";
import {NewUserSession} from "../../../domain/model/auth-interfaces";
import {NoSessionFound} from "../../../domain/errors/auth-errors";

export class SessionRepository implements UserSessionRepository {

    constructor(
        protected readonly ledger: Ledger,
    ) {
    }


    loadUserSession = async (sessionToken: string): Promise<NewUserSession> => {
        const session = await this.ledger.connection.query(`
                    SELECT users_session.user_id, users_session.session_token, users_session.expires_at
                    FROM postgres."perth-toilets".users_session as users_session
                    WHERE users_session.session_token = $1;
            `,
            [sessionToken]
        );
        if (session.rows.length === 0) {
            throw new NoSessionFound();
        }
        return {
            userId: session.rows[0].user_id,
            sessionToken: session.rows[0].session_token,
            expiry: session.rows[0].expires_at
        }
    }

    saveUserSession = async (userSession: NewUserSession): Promise<void> => {
        try {
            await this.ledger.connection.query(`
                        INSERT INTO postgres."perth-toilets".users_session
                            (session_token, user_id, expires_at, created_at)
                        VALUES ($1, $2, $3, DEFAULT)
                `,
                [userSession.sessionToken, userSession.userId, userSession.expiry]
            );
        } catch (err) {
            throw err;
        }
    }

    updateUserSession = async (sessionToken: string, expiry: string): Promise<void> => {
        try {
            await this.ledger.connection.query(`
                        UPDATE postgres."perth-toilets".users_session
                        SET expires_at = $2
                        WHERE session_token = $1;
                `,
                [sessionToken, expiry]
            );
        } catch (err) {
            throw err;
        }
    }

    deleteUserSession = async (sessionToken: string): Promise<void> => {
        try {
            await this.ledger.connection.query(`
                        DELETE
                        FROM postgres."perth-toilets".users_session as users_session
                        WHERE users_session.session_token = $1;
                `,
                [sessionToken]
            );
        } catch (err) {
            throw err;
        }
    }
}