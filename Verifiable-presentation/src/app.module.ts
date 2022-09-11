import { Module, HttpModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import AppController from "./app.controller";
import JwtService from "./services/jwt.service";
import StorageService from "./services/storage.service";
import TimestampService from "./services/timestamp.service";
import WalletService from "./services/wallet.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.dev"],
    }),
    WinstonModule.forRoot({
      transports: [
        // other transports...
      ],
      // other options
      level: process.env.LOG_LEVEL,
      // format: winston.format.json(),
      // defaultMeta: { service: 'user-service' },
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [JwtService, StorageService, TimestampService, WalletService],
})
export default class AppModule {}
