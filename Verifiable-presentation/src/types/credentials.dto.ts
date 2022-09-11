import { IsNotEmpty, IsString, NotEquals } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Publicly exposed structure.
 */
export default class CredentialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @NotEquals("null")
  readonly jwt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @NotEquals("null")
  readonly did: string;
}
