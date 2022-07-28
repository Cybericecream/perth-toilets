import {sign, verify} from "jsonwebtoken";
import {JwtInterface} from "../domain/model/jwt-interface";
import {JwtEnvVariables} from "./envValidator";

export class JwtVerify implements JwtInterface{
    constructor(private readonly jwtEnv: JwtEnvVariables) {
    }

    generateSessionToken = (data, expiry: number): string => {
        return sign({
            exp: expiry,
            data: data
        }, this.jwtEnv.jwtSalt);
    }

    verifySessionToken = (sessionToken: string) => {
        return verify(sessionToken, this.jwtEnv.jwtSalt);
    }

}