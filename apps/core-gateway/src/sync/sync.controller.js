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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncController = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const zod_pipe_1 = require("../zod.pipe");
const shared_1 = require("@sevens/shared");
const VariantSchema = zod_1.z.object({
    id: zod_1.z.string(),
    productId: zod_1.z.string(),
    sku: zod_1.z.string(),
});
let SyncController = class SyncController {
    syncProduct(body) {
        return shared_1.ProductSchema.parse(body);
    }
    syncVariant(body) {
        return VariantSchema.parse(body);
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Post)('product'),
    __param(0, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(shared_1.ProductSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "syncProduct", null);
__decorate([
    (0, common_1.Post)('variant'),
    __param(0, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(VariantSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "syncVariant", null);
exports.SyncController = SyncController = __decorate([
    (0, common_1.Controller)('sync/pim')
], SyncController);
