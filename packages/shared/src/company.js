"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanySchema = void 0;
const zod_1 = require("zod");
exports.CompanySchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    country: zod_1.z.string(),
    currency: zod_1.z.string(),
});
