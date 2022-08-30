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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WalletService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base64url_1 = __importDefault(require("base64url"));
const did_auth_1 = require("@cef-ebsi/did-auth");
const app_jwt_1 = require("@cef-ebsi/app-jwt");
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["STORE_CREDENTIAL"] = 0] = "STORE_CREDENTIAL";
    NotificationType[NotificationType["STORE_VERIFIABLEID"] = 1] = "STORE_VERIFIABLEID";
    NotificationType[NotificationType["REQUEST_PRESENTATION"] = 2] = "REQUEST_PRESENTATION";
    NotificationType[NotificationType["SIGN_PAYLOAD"] = 3] = "SIGN_PAYLOAD";
    NotificationType[NotificationType["SIGN_TX"] = 4] = "SIGN_TX";
})(NotificationType || (NotificationType = {}));
let WalletService = WalletService_1 = class WalletService {
    constructor(http, configService) {
        this.http = http;
        this.configService = configService;
        this.logger = new common_1.Logger(WalletService_1.name);
    }
    async login(privKey, iss) {
        this.logger.debug("Login with Wallet API");
        let payload;
        try {
            const agent = new app_jwt_1.Agent(app_jwt_1.Scope.ENTITY, privKey, {
                issuer: iss,
            });
            const nonce = crypto_1.default.randomBytes(16).toString("base64");
            payload = await agent.createRequestPayload("ebsi-wallet", {
                nonce,
            });
        }
        catch (error) {
            this.logger.error("Error while creating the self-signed token");
            this.logger.error(error);
            throw error;
        }
        const walletApi = this.configService.get("walletApi");
        try {
            const response = await this.http
                .post(`${walletApi}/sessions`, payload)
                .toPromise()
                .then((res) => res.data);
            this.logger.debug("Login successful");
            return response;
        }
        catch (error) {
            this.logger.error("Error while contacting Wallet API");
            if (error.response) {
                this.logger.error("Response data:");
                this.logger.error(error.response.data);
                this.logger.error("Response status:");
                this.logger.error(error.response.status);
                this.logger.error("Response headers:");
                this.logger.error(JSON.stringify(error.response.headers));
            }
            else if (error.request) {
                this.logger.error(error.request);
            }
            else {
                this.logger.error(error.message);
            }
            this.logger.error(error.config);
            throw error;
        }
    }
    async signVerifiableAttestation({ issuerDid, payload, token }) {
        const signPayload = {
            issuer: issuerDid,
            type: "EcdsaSecp256k1Signature2019",
            payload,
        };
        return this.http
            .post(`${this.configService.get("walletApi")}/signatures`, signPayload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .toPromise()
            .then((res) => res.data);
    }
    async sendVerifiableAttestation({ issuerDid, attestation, token, }) {
        const notificationPayload = {
            sender: issuerDid,
            notification: {
                target: attestation.credentialSubject.id,
                notificationType: NotificationType.STORE_CREDENTIAL,
                name: "Europass Diploma",
                data: { base64: base64url_1.default.encode(JSON.stringify(attestation)) },
                validationServiceEndpoint: `${this.configService.get("verifiableCredentialApi")}/verifiable-credential-validations`,
            },
        };
        const headers = { Authorization: `Bearer ${token}` };
        return this.http
            .post(`${this.configService.get("walletApi")}/notifications`, notificationPayload, {
            headers,
        })
            .toPromise()
            .then((res) => res.data);
    }
    async requestPresentation({ issuerDid, token, name, type, subscriberURL, redirectURL, target, }) {
        const presentationBody = {
            issuer: issuerDid,
            type,
        };
        const notificationPayload = {
            sender: issuerDid,
            notification: {
                target,
                notificationType: NotificationType.REQUEST_PRESENTATION,
                name,
                data: { base64: base64url_1.default.encode(JSON.stringify(presentationBody)) },
                validationServiceEndpoint: `${this.configService.get("verifiablePresentationApi")}/verifiable-presentation-validations`,
                subscriberURL,
                redirectURL,
            },
        };
        this.logger.log("Notification payload");
        this.logger.log(notificationPayload);
        return this.http
            .post(`${this.configService.get("walletApi")}/notifications`, notificationPayload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .toPromise()
            .then((res) => res.data);
    }
    async didAuth(accessToken, clientUrl) {
        const didAuthRequestCall = {
            redirectUri: clientUrl,
            signatureUri: `${this.configService.get("walletApi")}/signatures`,
            authZToken: accessToken,
        };
        const { uri, nonce } = await did_auth_1.EbsiDidAuth.createUriRequest(didAuthRequestCall);
        const redirectUrl = `${this.configService.get("walletWebClientUrl")}/auth?did-auth=${uri}`;
        return {
            redirectUrl,
            nonce,
        };
    }
    async validateDidAuth({ didAuthResponseJwt, accessToken, nonce, }) {
        return did_auth_1.EbsiDidAuth.verifyDidAuthResponse(didAuthResponseJwt, `${this.configService.get("walletApi")}/signature-validations`, accessToken, nonce);
    }
};
WalletService = WalletService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService,
        config_1.ConfigService])
], WalletService);
exports.WalletService = WalletService;
exports.default = WalletService;
//# sourceMappingURL=wallet.service.js.map