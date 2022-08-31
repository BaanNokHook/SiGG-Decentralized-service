import { CredentialSubject  } from "./credential-subject";   

export interface VeriableAttention { 
   "@context": string[]; 
   id: string;  
   type: string[];  
   credentialSubject: CredentialSubject;  
}