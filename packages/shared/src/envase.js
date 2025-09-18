"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvaseSchema = void 0;
const zod_1 = require("zod");
exports.EnvaseSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('new')]),
    name: zod_1.z.string(),
    tipo: zod_1.z.enum(['Bote', 'Doypack', 'Blister', 'Caja']).optional(),
    fotoUrl: zod_1.z.string().url().optional(),
    height: zod_1.z.number().optional(),
    width: zod_1.z.number().optional(),
    length: zod_1.z.number().optional(),
    peso: zod_1.z.number().optional(),
    capacidad: zod_1.z.string().optional()
});
