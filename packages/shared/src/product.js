"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const zod_1 = require("zod");
exports.ProductSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('new')]),
    name: zod_1.z.string(),
    sku: zod_1.z.string(),
    status: zod_1.z.enum(['En Estudio', 'Activo', 'Inactivo']),
    asin: zod_1.z.string().optional(),
    ean: zod_1.z.string().optional(),
    units: zod_1.z.number().optional()
});
