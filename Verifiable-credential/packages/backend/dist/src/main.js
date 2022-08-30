"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const winston = __importStar(require("winston"));
const nest_winston_1 = require("nest-winston");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = nest_winston_1.WinstonModule.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.timestamp(), nest_winston_1.utilities.format.nestLike()),
            }),
        ],
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger,
    });
    const configService = app.get(config_1.ConfigService);
    logger.logger.transports[0].level = configService.get("logLevel");
    logger.log(`Port: ${configService.get("port")}`, "ServerInfo");
    logger.log(`Prefix: ${configService.get("prefix")}`, "ServerInfo");
    logger.log(`Public URL: ${configService.get("publicUrl")}`, "ServerInfo");
    app.enableCors();
    app.use(helmet_1.default());
    app.use(express_rate_limit_1.default({
        windowMs: 1 * 60 * 1000,
        max: 100,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.setGlobalPrefix(configService.get("prefix"));
    await app.listen(configService.get("port"));
}
bootstrap();
//# sourceMappingURL=main.js.map