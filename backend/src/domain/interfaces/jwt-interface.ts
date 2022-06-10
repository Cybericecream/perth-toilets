export interface JwtInterface {
    generateSessionToken: (data, expiry: number) => string;
    verifySessionToken: (sessionToken: string) => any;
}