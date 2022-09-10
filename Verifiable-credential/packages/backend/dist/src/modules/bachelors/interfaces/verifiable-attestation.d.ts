import { CredentialSubject } from "./credential-subject";
export interface VerifiableAttestation {
    "@context": string[];
    id: string;
    type: string[];
    credentialSubject: CredentialSubject;
}
