import { HttpService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WalletService } from "../../common/services/wallet.service";
import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
import RequestPresentationDto from "./dtos/request-presentation.dto";
import ReceivePresentationDto from "./dtos/receive-presentation.dto";
import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
export declare class BachelorsService {
    private configService;
    private walletService;
    private readonly http;
    private readonly logger;
    constructor(configService: ConfigService, walletService: WalletService, http: HttpService);
    private login;
    createVerifiableAttestation(body: CreateVerifiableAttestationDto): Promise<any>;
    requestPresentation(body: RequestPresentationDto): Promise<any>;
    receivePresentation(body: ReceivePresentationDto): Promise<any>;
    didAuth(): Promise<{
        redirectUrl: string;
        nonce: string;
    }>;
    validateDidAuth(body: ValidateDidAuthDto): Promise<any>;
}
export default BachelorsService;
