import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
} from "@nestjs/common";
import { Response } from "express";

/**
 * Catch ForbiddenException at the API level
 * to be able to redirect when Did from JWT
 * does not macth did from local storage
 * Should be done in the front layer for v2
 */
@Catch(ForbiddenException)
export default class HttpForbiddenExceptionFilter implements ExceptionFilter {
  appPath: string = `${process.env.APP}demo`;

  catch(exception: ForbiddenException, host: ArgumentsHost): void {
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
