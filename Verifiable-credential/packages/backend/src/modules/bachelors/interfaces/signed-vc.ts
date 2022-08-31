import { VerifiableAttestation } from "./verifiable-attestation";   

export interface SignedVC {
      iat: number;  
      iss: string;  
      vc: VerifiableAttestation
}