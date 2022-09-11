import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import JwtService from "../services/jwt.service";
import CredentialDto from "../types/credentials.dto";

@Injectable()
export default class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(private jwtService: JwtService) {}

  /**
   * Validate that a jwt and did is present in the request body
   * @param context execution context
   */
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest();

    const cred: CredentialDto = request.body;

    this.logger.debug(`JwtGuard request:${JSON.stringify(request.body)} `);
    if (!cred.jwt || !cred.did) {
      this.logger.debug(`JwtGuard invalid user credentials`);
      throw new UnauthorizedException("invalid user credentials");
    }
    // extractPayloadFromToken
    const payload = this.jwtService.extractPayloadFromToken(cred);
    this.logger.debug(`JwtGuard validate payload:${JSON.stringify(payload)}`);

    return true;
  }
}
