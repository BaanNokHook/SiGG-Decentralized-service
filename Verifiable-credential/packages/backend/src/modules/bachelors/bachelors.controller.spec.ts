import { Test } from "@nestjs/testing";
import { Controller, HttpModule, HttpStatus } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Response } from "jest-express/lib/response";
import { BachelorsController } from "./bachelors.controller";
import { BachelorsService } from "./bachelors.service";
import { WalletService } from "../../common/services/wallet.service";
import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
import RequestPresentationDto from "./dtos/request-presentation.dto";
import ReceivePresentationDto from "./dtos/receive-presentation.dto";
import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
import configuration from "../../config/configuration";
import { serveStaticProviders } from "@nestjs/serve-static";


describe("bachelors.controller", () => {  
   let bachelorsController: BachelorsController;  
   let bachelorsService: BachelorsService;  

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
         controllers: [BachelorsController],  
         providers: [BachelorsService, WalletService],  
      }).compile();  

      bachelorsService = moduleRef.get<BachelorsService>(BachelorsService);  
      bachelorsController = moduleRef.get<BachelorsController>(  
         BachelorsController
      );   
   });     

   describe("createVerifiableAttestation", () => {  
      it("should return what bachelorsService.createVerifiableAttestation returns", async () => {  
         expect.assertions(3);  

         const req = {
            did: "did:sigg:12345",  
         }; 

         const response = new Response();  

         jest 
           .spyOn(BachelorsService, "createVerifiableAttestation")  
           .mockImplementation(  
             async (body: CreateVerifiableAttestationDto): Promise<any> => body     
           );   

         // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120   
         await bachelorsController.createVerifiableAttestation(req, response):  

         expect(response.send).toHaveBeenCalledWith(req);  
         expect(response.body).toBe(req); 
         expect(response.statusCode).toBe(HttpStatus.CREATED);  
      });
   });  

   describe("requestPresentation", () => {  
      it("should return what bachelorsService.requestPresentation returns", async () => {
         expect.assertions(3);  

         const req = {
            did: "did:sigg:12345",  
            redirectURL: "http://localhost/redirect",    
         };  

         const response = new Response();  

         jest
           .spyOn(BachelorsService, "requestPresentation")
           .mockImplementation(
              async (body: RequestPresentationDto): Promise<any> => body   
           );  

      // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120
      await bachelorsController.requestPresentation(req, response);

      expect(response.send).toHaveBeenCalledWith(req);
      expect(response.body).toBe(req);
      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });

  describe("receivePresentation", () => {
    it("should return what bachelorsService.receivePresentation returns", async () => {
      expect.assertions(3);

      const req = {
        vp: {},
      };

      const response = new Response();

      jest
        .spyOn(bachelorsService, "receivePresentation")
        .mockImplementation(
          async (body: ReceivePresentationDto): Promise<any> => body
          );
  
        // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120
        await bachelorsController.receivePresentation(req, response);
  
        expect(response.send).toHaveBeenCalledWith(req);
        expect(response.body).toBe(req);
        expect(response.statusCode).toBe(HttpStatus.OK);
      });
    });
  
    describe("didAuth", () => {
      it("should return what bachelorsService.didAuth returns", async () => {
        expect.assertions(2);
  
        const response = new Response();
  
        jest
          .spyOn(bachelorsService, "didAuth")
          .mockImplementation(async (): Promise<any> => "success");
  
        // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120
        await bachelorsController.didAuth(response);
  
        expect(response.body).toStrictEqual(expect.any(String));
        expect(response.statusCode).toBe(HttpStatus.OK);
      });
    });
  
    describe("validateDidAuth", () => {
      it("should return what bachelorsService.validateDidAuth returns", async () => {
        expect.assertions(2);
  
        const req = {
          didAuthResponseJwt: "123",
          nonce: "456",
        };
  
        const response = new Response();
  
        jest
          .spyOn(bachelorsService, "validateDidAuth")
          .mockImplementation(
            async (body: ValidateDidAuthDto): Promise<any> => body
          );
  
        // @ts-ignore: typings are not 100% supported https://github.com/jameswlane/jest-express/issues/120
        await bachelorsController.validateDidAuth(req, response);
  
        expect(response.send).toHaveBeenCalledWith();
        expect(response.statusCode).toBe(HttpStatus.CREATED);
      });
    });
 })
});