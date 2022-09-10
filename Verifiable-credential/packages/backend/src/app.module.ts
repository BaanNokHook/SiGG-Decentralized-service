import { Module, HttpModule } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import * as Joi from "@hapi/joi";
import { BachelorsController } from "./modules/bachelors/bachelors.controller";
import { BachelorsService } from "./modules/bachelors/bachelors.service";
import { MastersController } from "./modules/masters/masters.controller";
import { MastersService } from "./modules/masters/masters.service";
import { WalletService } from "./common/services/wallet.service";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      // ENV validation
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(8080),
        EBSI_ENV: Joi.string()
          .valid("local", "integration", "development", "production")
          .required(),
        NODE_ENV: Joi.string()
          .valid("development", "production", "test")
          .default("development"),
        BACHELOR_ISSUER: Joi.string().required(),
        BACHELOR_PRIVATE_KEY: Joi.string().required(),
        MASTER_ISSUER: Joi.string().required(),
        MASTER_PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const prefix = configService.get("prefix");
        return [
          {
            rootPath: join(__dirname, "../public/bachelor"),
            serveRoot: `${prefix}/bachelor`,
            exclude: [`${prefix}/api*`, `${prefix}/master*`],
          },
          {
            rootPath: join(__dirname, "../public/master"),
            serveRoot: `${prefix}/master`,
            exclude: [`${prefix}/api*`, `${prefix}/bachelor*`],
          },
        ];
      },
    }),
    HttpModule,
  ],
  controllers: [BachelorsController, MastersController],
  providers: [BachelorsService, MastersService, WalletService],
})
export class AppModule {}

export default AppModule;
