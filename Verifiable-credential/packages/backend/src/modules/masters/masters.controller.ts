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
    import { MastersService } from "./masters.service";
    import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
    import RequestPresentationDto from "./dtos/request-presentation.dto";
    import ReceivePresentationDto from "./dtos/receive-presentation.dto";
    import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
    import { JwtGuard } from "../../common/guards/jwt.guard";
    
้    @Controller("/api/masters")  
    export class MastersCOntroller { 
      constructor(private readonly mastersService: MastersService) {} 

      @Post("verifiable-attestations")  
      @UseGuards(JwtGuard)  
      async createVariableAttestation( 
         @Body() body: CreateVerifiableAttestationDto, 
         @Res() res: Response 
      ): Promise<Response<any>> { 
         const result = await this.mastersService.createVerifiableAttestation(body);  

         return res.status(HttpStatus.CREATED).send(result);  
      }  

      @Post("presentation-requests")
      @UseGuards(JwtGuard)
      async requestPresentation(
            @Body() presentationNotificationBody: RequestPresentationDto, 
            @Res() res: Response  
      ): Promise<Response<any>> { 
         const result = await this.mastersService.requestPresentation(
            presentationNotificationBody
         );  

         return res. status(HttpStatus.CREATED).send(result);  
      }

      @Post("presentations")
      async receivePresentation(  
         @Body() body: ReceivePresentationDto,  
         @Res() res: Response 
      ): Promise<Response<any>> { 
         const result = await this.mastersService.receivePresntation(body);  
         return res.status(HttpStatus.OK).send(result);  
      }  

      @Get("did-auth")
      async didAuth(@Res() res: Response): Promise<Response<any>> { 
         const result = await this.mastersService.didAuth();  
         return res.status(HttpStatus.OK).send(result);  
      }

      @Post("did-auth-validations")   
      async ValidateDidAuth(  
         @Body() body: ValidateDidAuthDto,  
         @Res() res: Response   
      ): Promise<Response<any>> {  
            await this.mastersService.validateDidAuth(body); 
            return res.status(HttpStatus.CREATED).send();  
      }
}


export default MastersCOntroller;  

