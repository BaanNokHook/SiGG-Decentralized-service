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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const Joi = __importStar(require("@hapi/joi"));
const bachelors_controller_1 = require("./modules/bachelors/bachelors.controller");
const bachelors_service_1 = require("./modules/bachelors/bachelors.service");
const masters_controller_1 = require("./modules/masters/masters.controller");
const masters_service_1 = require("./modules/masters/masters.service");
const wallet_service_1 = require("./common/services/wallet.service");
const configuration_1 = __importDefault(require("./config/configuration"));
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [configuration_1.default],
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
            serve_static_1.ServeStaticModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const prefix = configService.get("prefix");
                    return [
                        {
                            rootPath: path_1.join(__dirname, "../public/bachelor"),
                            serveRoot: `${prefix}/bachelor`,
                            exclude: [`${prefix}/api*`, `${prefix}/master*`],
                        },
                        {
                            rootPath: path_1.join(__dirname, "../public/master"),
                            serveRoot: `${prefix}/master`,
                            exclude: [`${prefix}/api*`, `${prefix}/bachelor*`],
                        },
                    ];
                },
            }),
            common_1.HttpModule,
        ],
        controllers: [bachelors_controller_1.BachelorsController, masters_controller_1.MastersController],
        providers: [bachelors_service_1.BachelorsService, masters_service_1.MastersService, wallet_service_1.WalletService],
    })
], AppModule);
exports.AppModule = AppModule;
exports.default = AppModule;
//# sourceMappingURL=app.module.js.map