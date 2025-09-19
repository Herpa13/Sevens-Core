"use strict";
const { defineConfig } = require("vitest/config");
const react = require("@vitejs/plugin-react").default;
const tsconfigPaths = require("vite-tsconfig-paths").default;

module.exports = defineConfig({
    plugins: [
        react({
            include: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'],
        }),
        tsconfigPaths(),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json'],
    },
    esbuild: {
        loader: 'tsx',
        include: [/\.tsx?$/, /\.jsx?$/],
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
    },
    ssr: {
        noExternal: [/@nestjs\/.*/, 'fastify'],
    },
});
