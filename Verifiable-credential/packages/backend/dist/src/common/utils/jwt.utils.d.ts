import { JwtPayload } from "../interfaces/jwt.payload";
export declare function decodeToken(token: string): object;
export declare function decodeTokenPayload(token: string): JwtPayload;
export declare function isTokenExpired(jwtPayload: JwtPayload): boolean;
export declare function generateSelfSignedToken({ audience, iss, privKey }: {
    audience: any;
    iss: any;
    privKey: any;
}): string;
