import {sign, verify} from "jsonwebtoken";
import {JwtInterface} from "../domain/interfaces/jwt-interface";

export class JwtVerify implements JwtInterface{
    constructor() {
    }

    generateSessionToken = (data, expiry: Date): string => {
        return sign({
            exp: expiry,
            data: data
        }, 'salt');
    }

    verifySessionToken = (sessionToken: string) => {
        return verify(sessionToken, 'salt');
    }

}