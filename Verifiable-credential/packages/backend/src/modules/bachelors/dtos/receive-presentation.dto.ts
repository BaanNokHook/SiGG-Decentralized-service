import { IsDefined, IsNotEmpty } from "class-validator";

export default class ReceivePresentationDto {
  @IsNotEmpty()
  @IsDefined()
  vp: any;
}
