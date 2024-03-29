import {Ledger} from "../pool";
import {
    LatestUserPassword,
    Role,
    User,
    UserPassword,
    UserRole,
} from "../../../domain/model/auth-interfaces";
import {UserRepository} from "../../../domain/model/auth-repository-interfaces";
import {
    DuplicatedUserPassword, 
    ExistingEmail,
    ExistingUsername,
    NoPasswordFound,
    NoUserFound
} from "../../../domain/errors/auth-errors";
import {Hasher} from "../../../domain/model/hash-interface";

export class AuthRepositories implements UserRepository {
    constructor(
        protected readonly ledger: Ledger,
        protected readonly hash: Hasher,
    ) {
    }

    loadUserPassword = async (userId: string): Promise<LatestUserPassword> => {
        const userPassword = await this.ledger.connection.query(`
                    SELECT user_passwords.user_id, user_passwords.password_value
                    FROM postgres."perth-toilets".users_passwords as user_passwords
                    WHERE user_passwords.user_id = $1
                    ORDER BY user_passwords.password_version DESC LIMIT 1;
            `,
            [userId]
        );
        if (userPassword.rows.length === 0) {
            throw new NoPasswordFound();
        }
        return {
            userId: userPassword.rows[0].user_id,
            passwordHash: userPassword.rows[0].password_value
        }
    }

    saveUserPassword = async (userPassword: UserPassword): Promise<void> => {
        try {

            if (userPassword.userId == undefined) {
                userPassword.userId = this.hash.generateUuid();
            }

            if (userPassword.passwordVersion === undefined) {
                userPassword.passwordVersion = 0;
            }

            await this.ledger.connection.query(`
                        INSERT INTO postgres."perth-toilets".users_passwords
                            (password_id, password_value, user_id, password_version, created_at)
                        VALUES (DEFAULT, $1, $2, $3, DEFAULT);`,
                [
                    userPassword.passwordHashed,
                    userPassword.userId,
                    userPassword.passwordVersion
                ]);
        } catch (err) {
            if (err.constraint === 'users_passwords_user_id_password_value_key') {
                throw new DuplicatedUserPassword(err);
            }
            throw err;
        }
    }

    loadUserById = async (userId: string): Promise<User> => {
        const user = await this.ledger.connection.query(`
                    SELECT users.user_id,
                           users.username,
                           users.email,
                           users.first_name,
                           users.last_name,
                           users.user_version,
                           users_roles.role,
                           users_roles.users_roles_version
                    FROM postgres."perth-toilets".users as users
                             INNER JOIN postgres."perth-toilets".users_roles as users_roles
                                        on users.user_id = users_roles.user_id
                    WHERE users.user_id = $1
                    ORDER BY users.user_version DESC,
                             users_roles.users_roles_version DESC LIMIT 1;
            `,
            [userId]
        );
        if (user.rows.length === 0) {
            throw new NoUserFound();
        }
        return {
            userId: user.rows[0].user_id,
            username: user.rows[0].username,
            email: user.rows[0].email,
            firstName: user.rows[0].first_name,
            lastName: user.rows[0].last_name,
            userVersion: user.rows[0].user_version,
            role: user.rows[0].role,
            userRoleVersion: user.rows[0].users_roles_version
        }
    }

    loadUserByEmail = async (email: string): Promise<User> => {
        const user = await this.ledger.connection.query(`
                    SELECT users.user_id,
                           users.username,
                           users.email,
                           users.first_name,
                           users.last_name,
                           users.user_version,
                           users_roles.role,
                           users_roles.users_roles_version
                    FROM postgres."perth-toilets".users as users
                             INNER JOIN postgres."perth-toilets".users_roles as users_roles
                                        on users.user_id = users_roles.user_id
                    WHERE users.email = $1
                    ORDER BY users.user_version DESC,
                             users_roles.users_roles_version DESC LIMIT 1;
            `,
            [email]
        );
        if (user.rows.length === 0) {
            throw new NoUserFound();
        }
        return {
            userId: user.rows[0].user_id,
            username: user.rows[0].username,
            email: user.rows[0].email,
            firstName: user.rows[0].first_name,
            lastName: user.rows[0].last_name,
            userVersion: user.rows[0].user_version,
            role: user.rows[0].role,
            userRoleVersion: user.rows[0].users_roles_version
        }
    }

    saveUser = async (user: User): Promise<string> => {
        try {

            if (user.userId == undefined) {
                user.userId = this.hash.generateUuid();
            }

            if (user.userVersion === undefined) {
                user.userVersion = 0;
            }

            const userVersion = user.userVersion + 1;

            const userResponse = await this.ledger.connection.query(`
                        INSERT
                        INTO postgres."perth-toilets".users
                        (user_id, username, email, first_name, last_name, user_version, created_at)
                        VALUES ($1, $2, $3, $4, $5, $6, DEFAULT)
                        RETURNING user_id
                `,
                [user.userId, user.username, user.email, user.firstName, user.lastName, userVersion]
            );

            if (userResponse.rows.length === 0) {
                throw new Error("Failed to create user.");
            }

            return userResponse.rows[0].user_id;
        } catch (err) {
            if (err.constraint === "users_username_key") {
                throw new ExistingUsername(err);
            }
            if (err.constraint === "users_email_key") {
                throw new ExistingEmail(err);
            }
            throw err;
        }
    }

    saveUserRole = async (userRole: UserRole): Promise<void> => {
        try {

            console.log(userRole);

            if (userRole.role === undefined) {
                userRole.role = Role.generalUser;
            }
            if (userRole.userRoleVersion === undefined) {
                userRole.userRoleVersion = 0;
            }

            await this.ledger.connection.query(`
                        INSERT INTO postgres."perth-toilets".users_roles
                            (user_id, role, created_at, users_roles_version)
                        VALUES ($1, $2, DEFAULT, $3)
                `,
                [userRole.userId, userRole.role, (userRole.userRoleVersion + 1)]
            )
        } catch (err) {
            throw err;
        }
    }
}