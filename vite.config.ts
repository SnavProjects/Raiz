import { defineConfig } from 'vite';
export default defineConfig({
  // Caminhos relativos permitem publicar em /Raiz/ sem quebrar os assets.
  base: './',
  server: { host: '0.0.0.0', port: 5173, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: { target: 'es2022', sourcemap: false },
});
