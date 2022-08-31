import {
      Body,
      Controller,
      Get,
      Post,
      Res,
      HttpStatus,
      UseGuards,
    } from "@nestjs/common";
    import { Response } from "express";
    import { BachelorsService } from "./bachelors.service";
    import RequestPresentationDto from "./dtos/request-presentation.dto";
    import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
    import ReceivePresentationDto from "./dtos/receive-presentation.dto";
    import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
    import { JwtGuard } from "../../common/guards/jwt.guard";

    @Controller("/api/bachelors")  
    export  class BachelorsController {
      constructor(private readonly bachelorsService: BachelorsService) {}    

      @Post("verifiable-attestations")  
      @UseGuards(JwtGuard)  
      async createVerifiableAttestation(
         @Body() body: CreateVerifiableAttestationDto,  
         @Res() res: Response  
      ): Promise<Response<any>> { 
         const result = await this.bachelorsService.createVerifiableAttestation(  
            body  
         );  

         return res.status(HttpStatus.CREATED).send(result);  
      } 

      @Post("presentation-requests")
      @UseGuards(JwtGuard) 
      async requestPresentation(
        @Body() presentationNotificationBody: RequestPresentationDto,  
        @Res() res: Response  
      ): Promise<Response<any>> {  
            const result = await this.bachelorsService.requestPresentation(  
               presentationNotificationBody
            );  

            return res.status(HttpStatus.CREATED).send(result);  
      }  

      @Post("presentations")  
      async receivePresentation(  
        @Body() body: ReceivePresentationDto,  
        @Res() res: Response   
      ): Promise<Response<any>> {  
         const result = await this.bachelorsService.receivePresentation(body);  
         return res.status(HttpStatus.OK).send(result);  
      }    

      @Get("did-auth")  
      async didAuth(@Res() res: Response): Promise<Response<any>> {  
        const result = await this.bachelorsService.didAuth();  
        return res.status(HttpStatus.OK).send(result);  
      }  

      @Post("did-auth-validations")  
      async validateDidAuth(
        @Body() body: ValidateDidAuthDto,  
        @Res() res: Response   
      ): Promise<Response<any>> {
         await this.bachelorsService.validateDidAuth(body); 
         return res.status(HttpStatus.CREATED).send(); 
      }
    }

    export default BachelorsController;  

