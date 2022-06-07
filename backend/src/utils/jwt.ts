import {sign, verify} from "jsonwebtoken";
import {JwtInterface} from "../domain/interfaces/jwt-interface";
import {JwtEnvVariables} from "./envValidator";

export class JwtVerify implements JwtInterface{
    constructor(private readonly jwtEnv: JwtEnvVariables) {
    }

    generateSessionToken = (data, expiry: Date): string => {
        const nowDate = new Date();
        const expiryInSeconds = (expiry.getTime() - nowDate.getTime()) / 1000;
        return sign({
            exp: expiryInSeconds,
            data: data
        }, this.jwtEnv.jwtSalt);
    }

    verifySessionToken = (sessionToken: string) => {
        return verify(sessionToken, this.jwtEnv.jwtSalt);
    }

}