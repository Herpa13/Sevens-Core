"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountrySchema = void 0;
const zod_1 = require("zod");
exports.CountrySchema = zod_1.z.object({
    id: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('new')]),
    name: zod_1.z.string(),
    iso: zod_1.z.string(),
    notificationProcess: zod_1.z.string().optional(),
    requiredDocuments: zod_1.z.string().optional()
});
