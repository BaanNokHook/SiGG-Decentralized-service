"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BachelorsController = void 0;
const common_1 = require("@nestjs/common");
const bachelors_service_1 = require("./bachelors.service");
const request_presentation_dto_1 = __importDefault(require("./dtos/request-presentation.dto"));
const create_verifiable_attestation_dto_1 = __importDefault(require("./dtos/create-verifiable-attestation.dto"));
const receive_presentation_dto_1 = __importDefault(require("./dtos/receive-presentation.dto"));
const validate_did_auth_dto_1 = __importDefault(require("../../common/dtos/validate-did-auth.dto"));
const jwt_guard_1 = require("../../common/guards/jwt.guard");
let BachelorsController = class BachelorsController {
    constructor(bachelorsService) {
        this.bachelorsService = bachelorsService;
    }
    async createVerifiableAttestation(body, res) {
        const result = await this.bachelorsService.createVerifiableAttestation(body);
        return res.status(common_1.HttpStatus.CREATED).send(result);
    }
    async requestPresentation(presentationNotificationBody, res) {
        const result = await this.bachelorsService.requestPresentation(presentationNotificationBody);
        return res.status(common_1.HttpStatus.CREATED).send(result);
    }
    async receivePresentation(body, res) {
        const result = await this.bachelorsService.receivePresentation(body);
        return res.status(common_1.HttpStatus.OK).send(result);
    }
    async didAuth(res) {
        const result = await this.bachelorsService.didAuth();
        return res.status(common_1.HttpStatus.OK).send(result);
    }
    async validateDidAuth(body, res) {
        await this.bachelorsService.validateDidAuth(body);
        return res.status(common_1.HttpStatus.CREATED).send();
    }
};
__decorate([
    common_1.Post("verifiable-attestations"),
    common_1.UseGuards(jwt_guard_1.JwtGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_verifiable_attestation_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], BachelorsController.prototype, "createVerifiableAttestation", null);
__decorate([
    common_1.Post("presentation-requests"),
    common_1.UseGuards(jwt_guard_1.JwtGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_presentation_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], BachelorsController.prototype, "requestPresentation", null);
__decorate([
    common_1.Post("presentations"),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [receive_presentation_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], BachelorsController.prototype, "receivePresentation", null);
__decorate([
    common_1.Get("did-auth"),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BachelorsController.prototype, "didAuth", null);
__decorate([
    common_1.Post("did-auth-validations"),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_did_auth_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], BachelorsController.prototype, "validateDidAuth", null);
BachelorsController = __decorate([
    common_1.Controller("/api/bachelors"),
    __metadata("design:paramtypes", [bachelors_service_1.BachelorsService])
], BachelorsController);
exports.BachelorsController = BachelorsController;
exports.default = BachelorsController;
//# sourceMappingURL=bachelors.controller.js.map