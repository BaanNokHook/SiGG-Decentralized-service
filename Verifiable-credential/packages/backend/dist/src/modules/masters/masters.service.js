"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MastersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MastersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const wallet_service_1 = require("../../common/services/wallet.service");
const jwt_utils_1 = require("../../common/utils/jwt.utils");
const masters_utils_1 = require("./masters.utils");
let MastersService = MastersService_1 = class MastersService {
    constructor(configService, walletService, http) {
        this.configService = configService;
        this.walletService = walletService;
        this.http = http;
        this.logger = new common_1.Logger(MastersService_1.name);
    }
    async login() {
        const privKey = this.configService.get("masterPrivateKey");
        const iss = this.configService.get("masterIssuer");
        try {
            const sessionResponse = await this.walletService.login(privKey, iss);
            return sessionResponse;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error while contacting Wallet API",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createVerifiableAttestation(body) {
        this.logger.debug("Create Verifiable Attestation");
        const { accessToken } = await this.login();
        const decodedToken = jwt_utils_1.decodeTokenPayload(accessToken);
        const issuerDid = decodedToken.did;
        const diplomaAttestation = masters_utils_1.formatVerifiableAttestation(body, issuerDid);
        let fullAttestation;
        try {
            const { jws } = await this.walletService.signVerifiableAttestation({
                issuerDid,
                payload: diplomaAttestation,
                token: accessToken,
            });
            fullAttestation = masters_utils_1.createFullVerifiableAttestation(jws);
            this.logger.debug("Full attestation");
            this.logger.debug(fullAttestation);
        }
        catch (e) {
            this.logger.error(e);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error while creating the full Master's VA",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            await this.walletService.sendVerifiableAttestation({
                issuerDid,
                attestation: fullAttestation,
                token: accessToken,
            });
            return "Successfully shared the Master's VA with the Wallet";
        }
        catch (e) {
            this.logger.error(e);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error while sharing the full Master's VA",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async requestPresentation(body) {
        this.logger.debug("Request Presentation");
        const { accessToken } = await this.login();
        const { redirectURL, did: target } = body;
        try {
            const decodedToken = jwt_utils_1.decodeTokenPayload(accessToken);
            const issuerDid = decodedToken.did;
            await this.walletService.requestPresentation({
                issuerDid,
                token: accessToken,
                name: "Request Verifiable ID and Europass Diploma",
                type: [
                    ["VerifiableCredential", "EssifVerifiableID"],
                    ["VerifiableCredential", "EuropassCredential"],
                ],
                subscriberURL: `${this.configService.get("internalUrl")}/api/masters/presentations`,
                redirectURL,
                target,
            });
            return "Successfully requested the presentation";
        }
        catch (e) {
            this.logger.error(e);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error while requesting the presentation",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async receivePresentation(body) {
        const { vp } = body;
        try {
            await this.http
                .post(`${this.configService.get("verifiablePresentationApi")}/verifiable-presentation-validations`, vp)
                .toPromise()
                .then((res) => {
                if (res.status !== common_1.HttpStatus.OK &&
                    res.status !== common_1.HttpStatus.CREATED &&
                    res.status !== common_1.HttpStatus.NO_CONTENT) {
                    throw new Error(`Request failed with status ${res.status}`);
                }
            });
            return "Successfully validated the presentation";
        }
        catch (e) {
            this.logger.error(e);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error while validating the presentation",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async didAuth() {
        const sessionResponse = await this.login();
        const { accessToken } = sessionResponse;
        return this.walletService.didAuth(accessToken, `${this.configService.get("publicUrl")}/master/login`);
    }
    async validateDidAuth(body) {
        const { didAuthResponseJwt, nonce } = body;
        const sessionResponse = await this.login();
        const { accessToken } = sessionResponse;
        try {
            await this.walletService.validateDidAuth({
                didAuthResponseJwt,
                accessToken,
                nonce,
            });
            this.logger.debug("DID Auth Response validated successfully");
        }
        catch (error) {
            this.logger.error("Invalid DID Auth Response or nonce");
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: "Invalid DID Auth Response or nonce",
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
MastersService = MastersService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        wallet_service_1.WalletService,
        common_1.HttpService])
], MastersService);
exports.MastersService = MastersService;
exports.default = MastersService;
//# sourceMappingURL=masters.service.js.map