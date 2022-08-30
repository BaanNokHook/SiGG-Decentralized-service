import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class JwtGuard implements CanActivate {
    private readonly logger;
    canActivate(context: ExecutionContext): boolean;
}
export default JwtGuard;
