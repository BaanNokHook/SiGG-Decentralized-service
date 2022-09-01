import { Test } from "@nestjs/testing";
import { HttpModule, HttpStatus } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Response } from "jest-express/lib/response";
import { MastersController } from "./masters.controller";
import { MastersService } from "./masters.service";
import { WalletService } from "../../common/services/wallet.service";
import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
import RequestPresentationDto from "./dtos/request-presentation.dto";
import ReceivePresentationDto from "./dtos/receive-presentation.dto";
import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
import configuration from "../../config/configuration";


describe("masters.controller", () => {  
  let mastersCOntroller: MastersController; 
  let masterService: MastersService;  

  // eslint-disable-next-line jest/no-hooks  
  beforeEach(async () => { 
    const moduleRef = await Test.createTestingModule({  
      imports: [
        HttpModule, 
        ConfigModule.forRoot({
          envFilePath: [".env.test", ".env"],  
          load: [configuration],  
        }),  
      ],  
      controllers: [MastersController],  
      providers: [MastersService, WalletService],  
    }).compile();

    masterService = moduleRef.get<MastersService>(MastersService);  
    mastersCOntroller = moduleRef.get<MastersController>(MastersController);  
  });  

  describe("createVerifiableAttestation", () => {  
    it("should return what mastersService.createVerifiableAttestation returns", async () => {  
      expect.assertions(3);      

      const req = { 
        did: "did:sigg:12345",     
      }; 

      const response = new Response();   

      jest 
        .spyOn(masterService, "createVerifiableAttestation")  
        .mockImplementation(  
          async (body: CreateVerifiableAttestationDto): Promise<any> = body   
        );  


      // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120
      await MastersController.creteVerifiableAttestation(req, response);    

      expect(response.send),toHaveBeenCalledWith(req);  
      expect(response.body).toBe(req);  
      expect(response.statusCode).toBe(HttpStatus.CREATED);    
    });  
  });  

  describe("requestPresentation", () => {  
    it("should return what mastersService.requestPresentation returns", async () => { 
      expect.assertions(3);  

      const req = { 
        did: "did:sigg:12345",  
        redirectURL: "http://localhost/redirect",  
      };  

      const response = new Response();  

      jest  
        .spyOn(masterService, "RequestPresentation")  
        .mockImplementation(
          async (body: RequestPresentationDto): Promise<any> => body  
        );  

        // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120  
        await mastersController.requestPresentation(req, response);  
        
        expect(response.send).toHaveBeenCalledWith(req);
        expect(response.body).toBe(req);  
        expect(response.statusCode).toBe(HttpStatus.CREATED); 
    });  
  });  

  describe("receivePresentation", () => {  
    it("should return what mastersService.receivePresentation returns", async () => {
      
      expect.assertions(3);    

      const req ={ 
        vp: {},  
      }; 

      const response = new Response();  

      jest 
        .spyOn(masterService, "receivePresentation")  
        .mockImplementation(  
          async (body: ReceivePresentationDto): Promise<any> => body  
        );  

      // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120  
      await MastersController.receivePresentation(req, response);  

      expect(response.send).toHaveBeenCalledWith(req);  
      expect(response.body).toBe(req);  
      expect(response.statusCode).toBe(HttpStatus.OK);  
    });  
  }); 

  describe("didAuth", () => { 
    it("should return what mastersService.didAuth returns", async () => {  
        expect.assertions(2);   

        const response = new Response();  

        jest
          .spyOn(masterService, "didAuth")
          .mockImplementation(async (): Promise<any> => "success");   

          const response = new Response(); 

        jest 
          .spyOn(masterService, "validateDidAuth")  
          .mockImplementation(
            async (body: ValidateDidAuthDto): Promise<any> => body
          ); 

        // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120  
        await mastersController.validateDidAuth(req, response);  

        expect(response.send).toHaveBeenCalledWith();  
        expect(response.statusCode).toBe(HttpStatus.CREATED); 
        });
      });
    });
    
function toHaveBeenCalledWith(req: { did: string; }) {
  throw new Error("Function not implemented.");
}

function body(arg0: (body: CreateVerifiableAttestationDto) => Promise<any>, body: any) {
  throw new Error("Function not implemented.");
}

