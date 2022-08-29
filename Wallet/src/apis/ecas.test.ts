import { loginLink, logout } from "./ecas";
import REACT_APP_SiGGLOGIN from "../config/env";
import * as values from "../test/mocks/values";


describe("ecas api", () => {
      it("should return the SiGG login url", () => {  
            expect.assertions(1);  

            const urlLogin = loginLink();  
            expect(urlLogin).toBe(  
               `${REACT_APP_SiGGLOGIN.REACT_APP_SiGGLOGIN}/${values.loginURL}`  
            );  
      });  

      it("should call the assign method with the url link in SiGG logout", () => {
            expect.assertions(1);   
            const urlFormated = encodeURIComponent(REACT_APP_SiGGLOGIN.REACT_APP_WALLET);   
            logout();  
            expect(window.location.assign).toHaveBeenCalledWith(  
              `${REACT_APP_SiGGLOGIN.REACT_APP_SiGGLOGIN}/logout!service=${urlFormated}&renew=false`   
            );  
      });
});


