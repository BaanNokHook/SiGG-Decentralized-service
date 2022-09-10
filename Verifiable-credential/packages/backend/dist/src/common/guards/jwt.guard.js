"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JwtGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_utils_1 = require("../utils/jwt.utils");
const formatException = (message) => new common_1.HttpException({
    status: common_1.HttpStatus.FORBIDDEN,
    error: "Forbidden",
    message,
}, common_1.HttpStatus.FORBIDDEN);
let JwtGuard = JwtGuard_1 = class JwtGuard {
    constructor() {
        this.logger = new common_1.Logger(JwtGuard_1.name);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (!request.headers || !request.headers.authorization) {
            this.logger.debug("Request is missing JWT");
            throw formatException("Missing JWT");
        }
        if (!request.headers.authorization.startsWith("Bearer ")) {
            this.logger.debug("Authorization header doesn't start with 'Bearer '");
            throw formatException("Invalid JWT");
        }
        let decodedToken;
        try {
            decodedToken = jwt_utils_1.decodeToken(request.headers.authorization.substr(7));
        }
        catch (e) {
            this.logger.debug("Unable to parse token");
            throw formatException("Unparseable JWT");
        }
        if (jwt_utils_1.isTokenExpired(decodedToken)) {
            this.logger.debug("JWT is expired");
            throw formatException("Expired JWT");
        }
        if (!decodedToken.sub_jwk ||
            !decodedToken.sub_jwk.kid ||
            !decodedToken.sub_jwk.kid.startsWith("did:ebsi:")) {
            this.logger.debug("Missing or malformed DID in JWT");
            throw formatException("Missing or malformed DID in JWT");
        }
        return true;
    }
};
JwtGuard = JwtGuard_1 = __decorate([
    common_1.Injectable()
], JwtGuard);
exports.JwtGuard = JwtGuard;
exports.default = JwtGuard;
//# sourceMappingURL=jwt.guard.js.map