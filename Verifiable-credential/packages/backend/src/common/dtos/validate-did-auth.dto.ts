import { IsDefined, isNotEmpty, IsNotEmpty } from "class-validator";

class ValidateDidAuthDto {  
   @IsNotEmpty()
   @IsDefined()  
   didAuthResponseJwt: string;  

   @IsNotEmpty()
   @IsDefined()
   nonce: string;   
}

export default ValidateDidAuthDto;  



