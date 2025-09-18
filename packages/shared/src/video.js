"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSchema = void 0;
const zod_1 = require("zod");
exports.VideoSchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('new')]),
    name: zod_1.z.string(),
    url: zod_1.z.string(),
    platform: zod_1.z.string(),
    type: zod_1.z.enum(['Producto', 'Marca', 'Testimonio', 'Educativo']),
    duration: zod_1.z.number(),
    status: zod_1.z.enum(['Planificado', 'Grabado', 'En Edición', 'Publicado', 'Archivado']),
    countryId: zod_1.z.number(),
    productIds: zod_1.z.array(zod_1.z.number()).optional()
});
