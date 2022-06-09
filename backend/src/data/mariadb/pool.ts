import {Pool} from "pg";
import {DbEnvVariables} from "../../utils/envValidator";

export class Ledger {
    public connection: Pool;

    constructor(
        private readonly dbEnv: DbEnvVariables
    ) {
        this.connection = new Pool({
            host: this.dbEnv.dbHost,
            port: this.dbEnv.dbPort,
            user: this.dbEnv.dbUser,
            password: this.dbEnv.dbPass,
            max: this.dbEnv.dbMaxConnections
        })
    }
}