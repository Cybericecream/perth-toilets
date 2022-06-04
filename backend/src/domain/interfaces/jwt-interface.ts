export interface JwtInterface {
    generateSessionToken: (data, expiry: Date) => string;
    verifySessionToken: (sessionToken: string) => any;
}