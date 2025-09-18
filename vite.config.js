"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// vitest.config.ts
const config_1 = require("vitest/config");
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
exports.default = (0, config_1.defineConfig)({
    plugins: [
        // CAMBIA ESTA LÍNEA:
        // tsconfigPaths(),
        // POR ESTA OTRA (con tres puntos delante):
        ...(0, vite_tsconfig_paths_1.default)(),
    ],
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
    },
});
