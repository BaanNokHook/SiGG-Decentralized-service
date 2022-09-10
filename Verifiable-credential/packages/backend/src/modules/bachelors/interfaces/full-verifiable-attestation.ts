import { VerifiableAttestation } from "./verifiable-attestation";
import { Proof } from "./proof";

export interface FullVerifiableAttestation extends VerifiableAttestation {
  issuer: string;
  issuanceDate: string;
  proof: Proof;
  expirationDate: string;
}

