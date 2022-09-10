import { Response } from "express";
import { BachelorsService } from "./bachelors.service";
import RequestPresentationDto from "./dtos/request-presentation.dto";
import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
import ReceivePresentationDto from "./dtos/receive-presentation.dto";
import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
export declare class BachelorsController {
    private readonly bachelorsService;
    constructor(bachelorsService: BachelorsService);
    createVerifiableAttestation(body: CreateVerifiableAttestationDto, res: Response): Promise<Response<any>>;
    requestPresentation(presentationNotificationBody: RequestPresentationDto, res: Response): Promise<Response<any>>;
    receivePresentation(body: ReceivePresentationDto, res: Response): Promise<Response<any>>;
    didAuth(res: Response): Promise<Response<any>>;
    validateDidAuth(body: ValidateDidAuthDto, res: Response): Promise<Response<any>>;
}
export default BachelorsController;
