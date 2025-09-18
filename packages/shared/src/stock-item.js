"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockItemSchema = void 0;
const zod_1 = require("zod");
exports.StockItemSchema = zod_1.z.object({
    warehouseId: zod_1.z.string(),
    variantId: zod_1.z.string(),
    quantity: zod_1.z.number(),
});
