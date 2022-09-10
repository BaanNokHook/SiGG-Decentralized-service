import {
      Injectable,
      Logger,
      HttpService,
      HttpException,
      HttpStatus,
    } from "@nestjs/common";
    import { ConfigService } from "@nestjs/config";
    import { WalletService } from "../../common/services/wallet.service";
    import { decodeToken, decodeTokenPayload } from "../../common/utils/jwt.utils";
    import { SessionsResponse } from "../../common/types/sessions.response";
    import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
    import RequestPresentationDto from "./dtos/request-presentation.dto";
    import ReceivePresentationDto from "./dtos/receive-presentation.dto";
    import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
    import {
      formatVerifiableAttestation,
      createFullVerifiableAttestation,
    } from "./masters.utils";

    @Injectable()  
    export class MastersService { 
      private readonly logger = new Logger(MastersService.name);  

      constructor(     
        private configService: ConfigService,  
        private walletService: WalletService,  
        private readonly http: HttpService 
      ) {}  

      private async login(): Promise<SessionsResponse> {
         const privKey = this.configService.get("masterPrivateKey");  
         const iss = this.configService.get("masterIssuer");    

         try {
            const sessionResponse = await this.walletService.login(privKey, iss);   
            return sessionResponse;  
         } catch (error) {  
            throw new HttpException(  
               {
                  status: HttpStatus.INTERNAL_SERVER_ERROR,  
                  error: "Error while contacting Wallet API",     
               },  
               HttpStatus.INTERNAL_SERVER_ERROR  
            );  
         }
      }

      async createVerifiableAttestation(  
         body: CreateVerifiableAttestationDto 
      ): Promise<any> { 
         this.logger.debug("Create Verifiable Attestation");  

         // Get session token 
         const  { accessToken } = await this.login();  

         // Format Verifiable Attestion 
         const decodedToken = decodeTokenPayload(accessToken);  
         const issuerDid = decodedToken.did;  
         const diplomaAttestation = formatVerifiableAttestation(body, issuerDid);    

         // Sign it  
         let fullAttestation;  
         try { 
            const { jws } = await this.walletService.signVerifiableAttestation({
               issuerDid,  
               payload: diplomaAttestation,  
               token: accessToken,  
            });  

            fullAttestation = createFullVerifiableAttestation(jws);  
            this.logger.debug("Full attestation");   
            this.logger.debug(fullAttestation);   
         } catch (e) {  
            this.logger.error(e);  
            throw new HttpException(  
               {
                  status: HttpStatus.INTERNAL_SERVER_ERROR,  
                  error: "Error while creating the full Masters's VA",  
               }, 
               HttpStatus.INTERNAL_SERVER_ERROR
            );  
         }

         // Send VA to Wallet  
         try {
            await this.walletService.sendVerifiableAttestation({   
               issuerDid,  
               attestation: fullAttestation,  
               token: accessToken,    
            });  
            
            return "Successfully shared the Master's VA with the wallet";  
         } catch (e) {
            this.logger.error(e);  
            throw new HttpException(
              {
                  status: HttpStatus.INTERNAL_SERVER_ERROR, 
                  error: "Error while sharing the full Master's VA",   
              },  
              HttpStatus.INTERNAL_SERVER_ERROR
            ); 
         }
      }   

      async requestPresentation(body: RequestPresentationDto): Promise<any> { 
        this.logger.debug("Request Presentation");  
        const { accessToken } = await this.login();  
        const { redirectURL, did: target } = body;  

        try {
            const decodedToken = decodeTokenPayload(accessToken);  
            const issuerDid = decodedToken.did;  

            await this.walletService.requestPresentation({  
               issuerDid,  
               token: accessToken,
               name: "Request Verifiable ID and SiGGpass Diploma",  
               type: [
                  ["VerifiableCredential", "EssifVerifiableID"],  
                  ["VerifiableCredential", "SiGGpassCredential"],  
               ],  
               subscribeURL: `${this.configService.get(   
                  "internalUrl"  
               )}/api/masters/presentations`,  
               redirectURL,  
               target, 
            });

            return "Successfully requested the presentation";  
        } catch (e) {     
            this.logger.error(e);   
            throw new HttpException(  
            {
                  status: HttpStatus.INTERNAL_SERVER_ERROR,  
                  error: "Error while requesting the presentation",    
            },
            HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
      } 

      async receivePresentation(body: ReceivePresentationDto): Promise<any> {   
        const { vp } = body;  

        try {
          await this.http  
            .post( 
                `${this.configService.get(  
                  "verifiablePresentationApi"  
                )}/verifiable-presentation-validations`,  
                vp 
            )
            .toPromise()
            .then((res) => { 
              if (  
                res.status !== HttpStatus.OK &&  
                res.status !== HttpStatus.CREATED &&  
                res.status !== HttpStatus.NO_CONTENT
              ) {  
                throw new Error(`Request failed with status ${res.status}`);   
              }
            });   
          return "Successfully validated the presentation";      
        } catch (e) {  
          this.logger.error(e);
          throw new HttpException(   
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,  
              error: "Error while validating the presentation",  
            }, 
            HttpStatus.INTERNAL_SERVER_ERROR  
          ); 
        }
      }

      async didAuth(): Promise<{ redirectUrl: string; nonce: string }> {
        // Get session token 
        const sessionResponse: SessionsResponse = await this.login();  
        const { accessToken } = sessionResponse;  

        return this.walletService.didAuth(  
          accessToken,  
          `${this.configService.get("publicUrl")}/master/login`
        ); 
      }

      async validateDidAuth(body: ValidateDidAuthDto): Promise<any> {
        const { didAuthResponseJwt, nonce } = body;  

        // Get session token
        const sessionResponse: SessionsResponse = await this.login();  
        const { accessToken } = sessionResponse;  

        try { 
          await this.walletService.validateDidAuth({  
            didAuthResponseJwt,  
            accessToken,
            nonce,
          });  

          this.logger.debug("DID Auth Response validated successfully");  
        } catch (error) {
          this.logger.error("Invalid DID Auth Response or nonce");  
          throw new HttpException(  
            {
              status: HttpStatus.BAD_REQUEST,  
              error: "Invalid DID Auth Response or nonce",  
            },  
            HttpStatus.BAD_REQUEST    
          );  
        }  
      }
    }


    export default MastersService;  

