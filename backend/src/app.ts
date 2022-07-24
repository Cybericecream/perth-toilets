import {server} from "./rest/express";
import {DbEnvValidator, JetEnvValidator, ServerEnvValidator} from "./utils/envValidator";
import {AuthUserPasswordCommandHandler} from "./domain/auth-command-handler";
import {Ledger} from "./data/mariadb/pool";
import {AuthRepositories} from "./data/mariadb/repositories/auth-repositories";
import {Hash} from "./utils/hash";
import {JwtVerify} from "./utils/jwt";
import {SessionRepository} from "./data/mariadb/repositories/session-repositroy";

const dbEnvVariables = new DbEnvValidator();
const serverEnvVariables = new ServerEnvValidator();
const jwtEnvVariables = new JetEnvValidator();

const hasher = new Hash();

const ledger = new Ledger(dbEnvVariables);
const authRepositories = new AuthRepositories(ledger, hasher);
const sessionRepositories = new SessionRepository(ledger);

const jwt = new JwtVerify(jwtEnvVariables);

const authUserPasswordCommandHandler = new AuthUserPasswordCommandHandler(authRepositories, sessionRepositories, hasher, jwt);

server(serverEnvVariables, authUserPasswordCommandHandler);