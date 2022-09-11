import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

import { join } from "path";
import * as hbs from "hbs";
import { Logger, NestApplicationOptions, ValidationPipe } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import * as winston from "winston";
import AppModule from "./app.module";

Logger.log(
  `API start, URL: ${process.env.PUBLIC_URL} NODE_ENV: ${process.env.NODE_ENV} port:${process.env.PORT}`,
  "main"
);

Logger.debug(`Log level: ${process.env.LOG_LEVEL}`, "main");

async function bootstrap() {
  const cors: CorsOptions = { methods: "*", origin: "*" };
  const opt: NestApplicationOptions = {
    cors,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike()
          ),
        }),
        // other transports...
      ],
      level: process.env.LOG_LEVEL,
    }),
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, opt);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(process.env.EUF_PATH_NAME);
  app.useStaticAssets(join(__dirname, "..", "public"), {
    prefix: process.env.EUF_PATH_NAME,
  });
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  // order here might be important as the layout requires some partials
  app.setViewEngine("hbs");
  hbs.registerPartials(join(__dirname, "..", "views/partials"), (err) => {
    if (err) {
      Logger.error(`Error loading partial template: ${err}`);
    }
  });
  app.set("view options", { layout: "layouts/layout" });

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
