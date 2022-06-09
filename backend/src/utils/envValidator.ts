export interface DbEnvVariables {
    dbHost: string;
    dbUser: string;
    dbPass: string;
    dbDatabase: string;
    dbPort: number;
    dbMaxConnections: number;
}

export interface ServerEnvVariables {
    projectPort: number;
}

export interface JwtEnvVariables {
    jwtSalt: string;
}

export class DbEnvValidator implements DbEnvVariables {
    public readonly dbHost: string;
    public readonly dbUser: string;
    public readonly dbPass: string;
    public readonly dbDatabase: string;
    public readonly dbPort: number;
    public readonly dbMaxConnections: number;

    constructor() {
        this.dbHost = validateEnvString('dbHost');
        this.dbUser = validateEnvString('dbUser');
        this.dbPass = validateEnvString('dbPass');
        this.dbDatabase = validateEnvString('dbSchema');
        this.dbPort = validateEnvNumber('dbPort');
        this.dbMaxConnections = validateEnvNumber('connectionLimits');
    }
}

export class ServerEnvValidator implements ServerEnvVariables {
    public readonly projectPort: number;

    constructor() {
        this.projectPort = validateEnvNumber('projectPort');
    }
}

export class JetEnvValidator implements JwtEnvVariables {
    public readonly jwtSalt: string;

    constructor() {
        this.jwtSalt = validateEnvString('jwtSalt');
    }

}

const validateEnvString = (envVariable: string): string => {
    try {
        const envKey = process.env[`${envVariable}`];
        if (!(envKey.length > 0)) {
            throw new Error(`Couldn't Validate String ${envVariable}.`)
        }
        return envKey;
    } catch (err) {
        console.error({
            message: err.message,
            error: err
        });
    }
}

const validateEnvNumber = (envVariable: string): number => {
    try {
        const env = parseInt(process.env[`${envVariable}`]);
        if (isNaN(env)) {
            throw new Error(`Couldn't Validate String ${envVariable}.`)
        }
        return env;
    } catch (err) {
        console.error({
            message: err.message,
            error: err
        });
    }
}