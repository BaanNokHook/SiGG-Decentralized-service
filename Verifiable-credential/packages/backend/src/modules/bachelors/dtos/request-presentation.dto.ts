import { IsString, IsDefined, IsNotEmpty, IsUrl } from "class-validator";

export default class RequestPresentationDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  did: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @IsDefined()
  redirectURL: string;
}
