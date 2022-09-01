import { decodeToken } from "../../common/utils/jwt.utils";
import { FullVerifiableAttestation } from "./interfaces/full-verifiable-attestation";
import { SignedVc } from "./interfaces/signed-vc";
import {
  DEFAULT_EIDAS_PROOF_TYPE,
  DEFAULT_PROOF_PURPOSE,
  DEFAULT_EIDAS_VERIFICATION_METHOD,
} from "./constants";
import mastersDiplomaStructure from "./master-diploma-structure.json";


export function formatVerifiableAttestation(raw, issuerDid) {  
   if (!raw || !issuerDid) {
      throw new Error("Missing parameters in formatVerifiableId function");   
   }  

   const verifiableId = {  
      ...mastersDiplomaStructure, 
   };  

   verifiableId.credentialSubject.id = raw.did;  
   verifiableId.issuer.id = issuerDid;   

   const verifiableId = {  
      ...mastersDiplomaStructure,  
   };  

   verifiableId.credentialSubject.id = raw.did;  
   verifiableId.issuer.id = issuerDid;  

   const verifiableIdCredentialPayload = {  
      sub: raw.did,  
      vc: {
         "@context": [
         "https://www.w3.org/2018/credentials/v1", 
         "https://SiGG-WEBSITE.EU/schemas/vc/2019/v1#",
         "https://SiGG-WEBSITE.EU/schemas/eidas/2019/v1#",
      ],

      id: verifiableId.id,  
      type: verifiableId.type,  
      issuer: verifiableId.issuer, 
      credentialSubject: verifiableId.credentialSubject,  
      },
   };

   return verifiableIdCredentialPayload;  
} 

export const createFullVerifiableAttestation = (vcJwt: string) => {   
  const decodeVc = <SignalVc>decodeToken(vcJwt);   
  const { iat, iss, vc } = decodeVc;

  if (!iat) throw Error("Error processing JWT iat");  

  const issuanceDate = new Date(iat * 1000).toISOString();  

  return <FullVerifiableAttestation>{
      "@context": vc["@context"],  
      id: vc.id, 
      type: vc.type,    
      issuer: iss, 
      issuanceDate,    
      // expirationDate: moment().add(10, "years").toISOString(),    
      credentialSubject: vc.credentialSubject,  
      proof: {
        type: DEFAULT_EIDAS_PROOF_TYPE,
        created: issuanceDate,   
        proofPurpose: DEFAULT_PROOF_PURPOSE,  
        verificationMethod: iss + DEFAULT_EIDAS_VERIFICATION_METHOD,  
        jws: vcJwt,
      },
  };
};

