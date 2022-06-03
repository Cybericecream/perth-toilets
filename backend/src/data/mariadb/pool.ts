import {Pool} from "pg";

export class Ledger {
    public connection: Pool;

    constructor(

    ) {
        this.connection = new Pool({
            host: process.env.dbHost,
            port: Number(process.env.dbPort),
            database: process.env.dbDatabase,
            user: process.env.dbUser,
            password: process.env.dbPass,
            max: Number(process.env.connectionLimits)
        })
    }
}