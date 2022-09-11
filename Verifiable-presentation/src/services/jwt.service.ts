import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JWT } from "jose";
import { JwtPayload } from "../types/jwt.payload";
import CredentialDto from "../types/credentials.dto";

@Injectable()
export default class JwtService {
  private readonly logger = new Logger(JwtService.name);

  private assertionToken = new Map<string, string>();

  private static decodeTokenPayload(token: string): JwtPayload {
    try {
      const r = JWT.decode(token);
      const l: JwtPayload = r as JwtPayload;
      return l;
    } catch (err) {
      return null;
    }
  }

  private static isTokenExpired(jwtPayload: JwtPayload) {
    return jwtPayload.exp * 1000 < Date.now();
  }

  private checkIfTokenPayloadValid(jwt: JwtPayload): boolean {
    if (JwtService.isTokenExpired(jwt)) {
      this.logger.debug(`----------token expired`);
      return false;
    }
    return true;
  }

  /**
   * extract and verify the payload of the credential jwt token
   * will throw if token is expired or did mismatch
   * @param cred credentials of the user (did and jwt issued by wallet api)
   */
  extractPayloadFromToken(cred: CredentialDto): JwtPayload {
    const payload: JwtPayload = JwtService.decodeTokenPayload(cred.jwt);

    if (payload) {
      const isValid = this.checkIfTokenPayloadValid(payload);

      if (!isValid) {
        this.logger.debug(`----------token expired`);
        throw new UnauthorizedException("token expired");
      }
      this.logger.debug(
        `----------extractPayloadFromToken ${cred.did} ${payload.did}`
      );
      if (cred.did !== payload.did) {
        throw new ForbiddenException(
          `did ${cred.did} does not match token did ${payload.did}`
        );
      }
      return payload;
    }
    return null;
  }
}
