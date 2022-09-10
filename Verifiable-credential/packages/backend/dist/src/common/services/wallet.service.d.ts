import { HttpService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SessionsResponse } from "../types/sessions.response";
export declare class WalletService {
    private readonly http;
    private configService;
    private readonly logger;
    constructor(http: HttpService, configService: ConfigService);
    login(privKey: string, iss: string): Promise<SessionsResponse>;
    signVerifiableAttestation({ issuerDid, payload, token }: {
        issuerDid: any;
        payload: any;
        token: any;
    }): Promise<any>;
    sendVerifiableAttestation({ issuerDid, attestation, token, }: {
        issuerDid: any;
        attestation: any;
        token: any;
    }): Promise<any>;
    requestPresentation({ issuerDid, token, name, type, subscriberURL, redirectURL, target, }: {
        issuerDid: any;
        token: any;
        name: any;
        type: any;
        subscriberURL: any;
        redirectURL: any;
        target: any;
    }): Promise<any>;
    didAuth(accessToken: any, clientUrl: any): Promise<{
        redirectUrl: string;
        nonce: string;
    }>;
    validateDidAuth({ didAuthResponseJwt, accessToken, nonce, }: {
        didAuthResponseJwt: any;
        accessToken: any;
        nonce: any;
    }): Promise<any>;
}
export default WalletService;
