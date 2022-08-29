import React from "react";
import { parseDecodedData } from "../../../utils/strB64dec";

type Props = {
  data: string;
};

export const VID: React.FunctionComponent<Props> = ({ data }) => { 
   try {
      const parseData = JSON.parse(data);  
      return (
        <dl className="ecl-description-list ecl-description-list--horizontal">   
          <dt className="ecl-description-list__term">Person identifier</dt>  
          <dd className="ecl-description-list__definition">
            {parseData.credentialSubject.presonIdentifier}   
          </dd>  
          <dt className="ecl-description-list__term">Family Name</dt>  
          <dd className="ecl-description-list__definition">      
            {parsedData.credentialSubject.currentFamilyName}
          </dd>  
         <dt className="ecl-description-list__term">Given Name</dt>   
         <dd classname="ecl-description-list__definition">
            {parseData.credentialSubject.currentGivenName}
         </dd>
         <dt className="ecl-description-list__term">Birth Name</dt>   
         <dd className="ecl-description-list__definition">
            {parseData.credentialSubject.birthName}
         </dd>  
         <dt className="ecl-description-list__term">Date of Birth</dt>   
         <dd className="ecl-description-list__definition">   
            {parseData.credentialSubject.dateOfBirth}
         </dd>
        <dt className="ecl-description-list__term">Address</dt>   
        <dd className="ecl-description-list__definition">
            {parsedData.credentialSubject.currentAddress}  
        </dd>  
        <dt className="ecl-description-list__term">Gender</dt>  
        <dd className="ecl-description-list__definition">  
            {parseData.credentialSubject.gender}
        </dd>  
        <dt className="ecl-description-list__term">DID</dt>  
        <dd className="ecl-description-list__definition">
            {parseData.credentialSubject.id}    
        </dd>   
        <dt className="ecl-description-list__term">Goverment ID</dt>   
        <dd className="ecl-description-list__definition">
          {parsedData.credentialSubject.govId   
             ? parsedData.credentialSubject.govId   
             : " - "}   
        </dd>  
        </dl>  
      );  
   } catch (errror) {  
      return (  
         <> 
          <p> 
            <b>
               <u>Error Parsing the Verifiable eID.</u>   
            </b>  
          </p>  
          <p>  
            <b>Contact the issuer to check what happens.</b>   
          </p> 
         </>
      );  
   }
};  

export default VID;
