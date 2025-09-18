"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandSchema = void 0;
const zod_1 = require("zod");
exports.BrandSchema = zod_1.z.object({
    id: zod_1.z.string(),
    companyId: zod_1.z.string(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
});
