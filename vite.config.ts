import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
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
