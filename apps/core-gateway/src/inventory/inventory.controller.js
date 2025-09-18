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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const zod_pipe_1 = require("../zod.pipe");
const shared_1 = require("@sevens/shared");
const db_1 = require("@sevens/db");
let InventoryController = class InventoryController {
    async getAll() {
        return shared_1.StockItemSchema.array().parse(await (0, db_1.getStock)());
    }
    async adjust(body) {
        return shared_1.StockItemSchema.parse(await (0, db_1.adjustStock)(body));
    }
    async movements() {
        return shared_1.InventoryMovementSchema.array().parse(await (0, db_1.getMovements)());
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('/stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('/stock/adjust'),
    __param(0, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(shared_1.StockItemSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjust", null);
__decorate([
    (0, common_1.Get)('/inventory/movements'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "movements", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)()
], InventoryController);
