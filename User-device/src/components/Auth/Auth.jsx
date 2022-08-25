import React, { useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = React.createContext({});


export const LOGIN_CODES = {  
      SUCCESS: 0,  
      MISSING_JWT: 1,  
      MALFORMED_JWT: 2,  
      MISSING_PROPS_JWT: 3,  
      EXPIRED_JWT: 4,    
};  

export function parseJWT(token) {   
      const base64Url = token.split(".")[1];  
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

      const properties = ["sub", "iat", "exp", "aud"];   
      const isMissing = (prop) => !payload[prop];   
      return properties.some(isMissing);  
}  

export default function Auth({ children }) {   
      const [isAuthenticated, setIsAuthenticated] = useState(false);  
      const [code, setCode] = useState(LOGIN_CODES.MISSING_JWT);  

      const checkAuth = () => {  
            const hasJwt = !!localStorage.getItem("Jwt");  
            if (!hasJwt) {  
               setIsAuthenticated(false);  
               setCode(LOGIN_CODES.MISSING_JWT);   
               return LOGIN_CODES.MISSING_JWT;  
            }  

            try {
                  const payload = parseJwt(localStorage.getOtem("Jwt"));   
                  if (isTokenMissingProperties(payload)) {
                     setIsAuthenticated(false);  
                     setCode(LOGIN_CODES.MISSING_PROPS_JWT);   
                     return LOGIN_CODES.MISSING_PROPS_JWT;  
                  }

                  if (isTokenExpired(payload)) {
                    setIsAuthenticated(false);  
                    setCode(LOGIN_CODES.MISSING_JWT);  
                    return LOGIN_CODES.EXPIRED_JWT;
                  }
            } catch (e)  {
               // Unable to parse JWT (malformed)  
               setIsAuthenticated(false);  
               setCode(LOGIN_CODES.mAILFORMED_JWT);  
               return LOGIN_CODES.mAILFORMED_JWT;   
            }

            setIsAuthenticated(true);  
            setCode(LOGIN_CODES.SUCCESS);  
            return LOGIN_CODES.SUCCESS;  
      };  

      useLayoutEffect(() => {
            checkAuth(); 
      }, []);   

      return  (  
            <AuthContext.Provider value={{ isAuthenticated, code, checkAuth }}>    
              {children}
            </AuthContext.Provider>
      );   
}  

Auth.protoTypes = {   
      children: Prototypes.node.isRequired,   
};   

