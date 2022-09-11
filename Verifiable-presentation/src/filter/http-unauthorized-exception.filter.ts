import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";

/**
 * Catch UnauthorizedException at the API level
 * to be able to redirect when JWT from local storage is missing
 * Should be done  in the front layer for v2
 */
@Catch(UnauthorizedException)
export default class HttpUnauthorizedExceptionFilter
  implements ExceptionFilter {
  appPath: string = `${process.env.APP}demo`;

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.header("Location", this.appPath);
    response.status(302).json({
      statusCode: 302,
      timestamp: new Date().toISOString(),
      path: this.appPath,
    });
  }
}
