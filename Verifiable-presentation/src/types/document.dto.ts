import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import CredentialDto from "./credentials.dto";

/**
 * Publicly exposed structure.
 */

export default class DocumentDto extends CredentialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly hash: string;
}
