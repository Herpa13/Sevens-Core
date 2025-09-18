"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMovementSchema = void 0;
const zod_1 = require("zod");
exports.InventoryMovementSchema = zod_1.z.object({
    id: zod_1.z.string(),
    stockItemId: zod_1.z.string(),
    type: zod_1.z.enum(['ADJUSTMENT']),
    quantity: zod_1.z.number(),
    createdAt: zod_1.z.date(),
});
