import {Hasher} from "../domain/interfaces/hash-interface";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

export class Hash implements Hasher {
    constructor(

    ) {
    }

    hashPassword = (password: string): string => {
        return Base64.stringify(sha256(password));
    }
}