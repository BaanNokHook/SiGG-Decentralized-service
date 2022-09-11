import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Publicly exposed structure.
 */

export default class VerifyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly docHash: string;
}
