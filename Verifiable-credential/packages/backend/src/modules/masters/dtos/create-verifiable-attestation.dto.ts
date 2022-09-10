import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export default class CreateVerifiableAttestationDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  did: string;
}
