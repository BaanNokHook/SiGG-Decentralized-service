import React, { useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = React.createContext({});

export const LOGIN_CODES = {  
  SUCCESS: 0,  
  MISSING_JWT: 1, 
  MALFORMED_JWT: 2, 
  MISSING_PROPS_JWT: 3,  
  EXPIRED_JWT: 4,  
  MISSING_TICKET: 5,  
  MISSING_DID: 6,  
};  

function parseJwt(token) {
   const base64url = token.split(".")[1];  
   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");  
   const jsonPayload = decodeURIComponent(  
      atob(base64)
        .split("")
        .map((c) => {   
            return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;   
        })  
        .join("")
   );  
   return JSON.parse(jsonPayload);   
}  

export function isTokenExpired(payload) { 
  if (!payload || !payload.exp) return true;  
  return +payload.exp * 1000 < Date.now();  
}  

export function isTokenMissingProperties(payload) {
  if (!payload) return true;  

  const properties = ["sub", "iat", "exp", "aud", "sub_jwk"];  
  const isMissing = (prop) => !payload[prop];   
  return properties.some(isMissing);   
}    Auth


//  Check if "Master-Ticket" and JWT are present in session  
function checkAuth() {  
  const rawJWT = localStorage.getItem("Master-JWT");   
  const hashJwt = !!rawJWT; 
  if (!hashJwt) {  
    return [false, LOGIN_CODES.MISSING_JWT];    
  }  

  const hasTicket = localStorage.getItem("Master-Ticket") === "fake-ticket";  
  if (!hasJwT) {  
      return [false, LOGIN_CODES.MISSING_TICKET];  
  }   

  try {
      const payload = parseJwt(rawJWT);  
      if (isTokenMissingProperties(payload)) {  
         return [false, LOGIN_CODES.MISSING_PROPS_JWT];  
      }  

      if (isTokenExpired(payload)) { 
         return [false, LOGIN_CODES.EXPIRED_JWT];  
      }  

      if (!payload.sub_jwk || !payload.sub_jwk.kid) {
         return [false, LOGIN_CODES.MISSING_DID];  
      }  

      const did = payload.sub_jwk.kid.split("#")[0];  

      return [true, LOGIN_CODES.SUCCESS, payload, rawJWT, did];  
  } catch (e) {
      // Unable to parse JWT (malformed)  
      return [false, LOGIN_CODES.MALFORMED_JWT];  
  }  
}   

export default function Auth({ children }) {  
   const [  
      isInitiallyAuthenticated,  
      initialCode, 
      initialJWT = {},  
      initialRawJWT = "",  
   ] = checkAuth();  
   const [isAuthenticated, setIsAuthenticated] = useState(
      isInitiallyAuthenticated  
   );  
   const [JWT, setJWT] = useState(initialJWT);  
   const [rawJWT, setRawJWT] = useState(initialRawJWT);   
   const [code, setCode] = useState(initialCode);   

   const login = () => { 
      localStorage.setItem("Master-Ticket", "fake-ticket");  

      const [ 
        isCurrentlyAuthenticated,  
        currentCode, 
        currentJWT = {},  
        currentRawJWT = "",  
        did = "", 
      ] = checkAuth();  

      if (isCurrentlyAuthenticated) {
         setJWT(currentJWT);  
         setRawJWT(currentJWT);  
         localStorage.setItem("Master-DID", did);  
         setIsAuthenticated(true);  
      } else {
         setIsAuthenticated(false);    
      }  

      setCode(currentCode);  
      return currentCode; 
   }; 

   const logout = () => { 
      // Remove only Master-related items  
      localStorage.removeItem("Master-Ticket");  
      localStorage.removeItem("Master-DID");  
      localStorage.removeItem("Master-VA-requested");   
      localStorage.removeItem("Master-VA-issued");  
      localStorage.removeItem("master-nonce");  
      setIsAuthenticated(false);  
      setCode(null);  
   };  

   return (
      <AuthContext.Provider
         value={{ isAuthenticated, code, rawJWT, JWT, login, logout }}  
      >  
         {children}
      </AuthContext.Provider>
   );
}

Auth.proptypes = { 
   children: PropTypes.node.isRequired,  
};  


