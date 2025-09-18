// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
  ],
  test: {
    // ... tu configuración de test ...
  },
  ssr: {
    // Opción más amplia: no externalizar NINGÚN paquete que empiece con @nestjs
    // y tampoco fastify. Esto es más robusto.
    noExternal: [/@nestjs\/.*/, 'fastify'],
  },
});