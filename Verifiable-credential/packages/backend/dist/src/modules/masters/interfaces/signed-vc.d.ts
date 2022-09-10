import { VerifiableAttestation } from "./verifiable-attestation";
export interface SignedVc {
    iat: number;
    iss: string;
    vc: VerifiableAttestation;
}
