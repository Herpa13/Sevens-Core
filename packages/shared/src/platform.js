"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformSchema = void 0;
const zod_1 = require("zod");
exports.PlatformSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('new')]),
    name: zod_1.z.string(),
    countryId: zod_1.z.number(),
    type: zod_1.z.enum(['Marketplace', 'Reventa', 'Web propia', '']),
    status: zod_1.z.enum(['En estudio', 'En apertura', 'Activa', 'Cerrada']),
    shipsBy: zod_1.z.enum(['Platform', 'Us']),
    url: zod_1.z.string().url().optional(),
    orderSystemUrl: zod_1.z.string().url().optional(),
    orderSystemUser: zod_1.z.string().optional(),
    orderSystemPassword: zod_1.z.string().optional(),
    orderSystemDetails: zod_1.z.string().optional()
});
