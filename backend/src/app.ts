import {server} from "./rest/express";
import {DbEnvValidator, JetEnvValidator, ServerEnvValidator} from "./utils/envValidator";
import {AuthUserPasswordCommandHandler} from "./domain/auth-command-handler";
import {Ledger} from "./data/mariadb/pool";
import {AuthRepositories} from "./data/mariadb/repositories/auth-repositories";
import {Hash} from "./utils/hash";
import {JwtVerify} from "./utils/jwt";
import {SessionRepository} from "./data/mariadb/repositories/session-repositroy";
import {SessionCommandHandler} from "./domain/session-command-handler";
import {authRoutes} from "./rest/auth/auth-routes";

try {
    const dbEnvVariables = new DbEnvValidator();
    const serverEnvVariables = new ServerEnvValidator();
    const jwtEnvVariables = new JetEnvValidator();

    const hasher = new Hash();

    const ledger = new Ledger(dbEnvVariables);
    const authRepositories = new AuthRepositories(ledger, hasher);
    const sessionRepositories = new SessionRepository(ledger);

    const jwt = new JwtVerify(jwtEnvVariables);

    const sessionCommandHandler = new SessionCommandHandler(sessionRepositories, jwt);
    const authUserPasswordCommandHandler = new AuthUserPasswordCommandHandler(authRepositories, sessionCommandHandler, hasher, jwt);

    const restServer = server();

    restServer.run(serverEnvVariables, sessionCommandHandler, [
        {
            url: '/auth',
            routeHandler: authRoutes(authUserPasswordCommandHandler),
        },
    ], []);

    const endApi = async () => {
        await restServer.stop();
    }

    process.on('SIGTERM', endApi);
    process.on('SIGINT', endApi);
    process.on('SIGHUP', endApi);
} catch (err) {
    console.log(err);
    process.exit(0);
}
