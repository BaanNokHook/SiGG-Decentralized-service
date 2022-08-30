"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSelfSignedToken = exports.isTokenExpired = exports.decodeTokenPayload = exports.decodeToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const base64url_1 = __importDefault(require("base64url"));
const jose_1 = require("jose");
function decodeToken(token) {
    if (!token) {
        throw new Error("Missing token");
    }
    return jose_1.JWT.decode(token);
}
exports.decodeToken = decodeToken;
function decodeTokenPayload(token) {
    if (!token) {
        throw new Error("Missing token");
    }
    const r = decodeToken(token);
    const l = r;
    return l;
}
exports.decodeTokenPayload = decodeTokenPayload;
function isTokenExpired(jwtPayload) {
    if (!jwtPayload || !jwtPayload.exp) {
        throw new Error("Invalid JWT payload provided");
    }
    return jwtPayload.exp * 1000 < Date.now();
}
exports.isTokenExpired = isTokenExpired;
function generateSelfSignedToken({ audience, iss, privKey }) {
    if (!audience || !iss || !privKey) {
        throw new Error("Invalid parameters");
    }
    const nonce = crypto_1.default.randomBytes(16).toString("base64");
    const tokenPayload = {
        iss,
        nonce,
    };
    const key = jose_1.JWK.asKey(base64url_1.default.decode(privKey));
    const token = jose_1.JWT.sign(tokenPayload, key, {
        expiresIn: "15 seconds",
        audience,
        header: {
            typ: "JWT",
        },
    });
    return token;
}
exports.generateSelfSignedToken = generateSelfSignedToken;
//# sourceMappingURL=jwt.utils.js.map