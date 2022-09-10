import { Response } from "express";
import { MastersService } from "./masters.service";
import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
import RequestPresentationDto from "./dtos/request-presentation.dto";
import ReceivePresentationDto from "./dtos/receive-presentation.dto";
import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
export declare class MastersController {
    private readonly mastersService;
    constructor(mastersService: MastersService);
    createVerifiableAttestation(body: CreateVerifiableAttestationDto, res: Response): Promise<Response<any>>;
    requestPresentation(presentationNotificationBody: RequestPresentationDto, res: Response): Promise<Response<any>>;
    receivePresentation(body: ReceivePresentationDto, res: Response): Promise<Response<any>>;
    didAuth(res: Response): Promise<Response<any>>;
    validateDidAuth(body: ValidateDidAuthDto, res: Response): Promise<Response<any>>;
}
export default MastersController;
